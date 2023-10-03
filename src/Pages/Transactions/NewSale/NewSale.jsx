import React, { useContext, useEffect, useState } from "react";
import Modal from "react-bootstrap/Modal";
import Table from "../../../Components/Table/Table";
import AsyncSelect from "react-select/async";
import Select from "react-select";
import "./NewSale.css";
import { api } from "../../../Services/api-service";
import notificationSvc from "../../../Services/notification";
import {
  LEFT_ALIGN,
  LEFT_ALIGN_WITH_BORDER,
  datatableStyle,
  paginationStyle,
} from "../../../Utils/Util";
import TableWare from "../../../Components/DataTable/TableWare.tsx";
import { AiFillDelete } from "react-icons/ai";
import { Link, useNavigate, useParams } from "react-router-dom";
import NumericInput from "react-numeric-input";
import Checkbox from "rc-checkbox";
import { StoreContext } from "../../../Components/StoreContext";

const NewSale = () => {
  const navigate = useNavigate();
  const [customers, setCustomers] = useState([]);
  const [selectedCustomer, setSelectedCustomer] = useState({});
  const [receiptItems, setReceiptItems] = useState([]);

  const { id } = useParams();

  const { selectedStore } = useContext(StoreContext);

  console.log("Receipt Items", receiptItems);

  const [addMisc, setAddMisc] = useState({
    product_name: "",
    price: "",
    quantity: "",
    cost: "",
  });
  const [credit, setCredit] = useState("");
  const [totalPrice, setTotalPrice] = useState(0.0);
  const [discountP, setDiscountP] = useState(0);
  const [modal, setModal] = useState({
    showCustomer: false,
    showPay: false,
    showInventory: false,
    showAddMisc: false,
    tax: false,
    showTrade: false,
  });
  const [discountAmount, setDiscountAmount] = useState(0);
  const [taxAmount, setTaxAmount] = useState(0);
  const [stores, setStores] = useState([]);

  const [subTotal, setSubTotal] = useState(0);

  const [taxEdit, setTaxEdit] = useState(0);
  const [taxCheck, setTaxCheck] = useState(true);
  const [cusChecked, setCusChecked] = useState(false);
  const [originalTax, setOriginalTax] = useState(0);

  const [loading, setLoading] = useState(false);
  const [json, setJson] = useState([]);
  const [orderBy, setOrderBy] = useState(null);
  const [orderByDir, setOrderByDir] = useState(null);
  const [pageIndex, setPageIndex] = useState(1);
  const [pageSize, setPageSize] = useState(20);
  const [searchString, setSearchString] = useState("");
  const [totalCount, setTotalCount] = useState(0);
  const [isSearching, setIsSearching] = useState(false);

  const ShowSearch = () => {
    setIsSearching(true);
  };

  const closeSearch = () => {
    setIsSearching(false);
  };

  const [inventory, setInventory] = useState([]);
  const [transaction, setTransaction] = useState({
    id: "",
    store: {
      id: "",
      name: "",
    },
    customer: {
      name: "",
      id: "",
    },
    inventory: [],
    creditUsed: 0,
    TransactionType: "Processed",
    PaymentType: "Cash",
    discount: 0,
    Tax: 0,
    SubTotal: 0,
    TotalAmountPaid: 0,
  });

  const handleClose = (key) => () =>
    setModal((prevState) => ({ ...prevState, [key]: false }));
  const handleShow = (key) => () =>
    setModal((prevState) => ({ ...prevState, [key]: true }));

  useEffect(() => {
    getStores();
  }, []);

  useEffect(() => {
    if (selectedStore) {
      getTax(selectedStore.value);
      getDiscount(selectedStore.value);
      getCustomer(selectedStore.value);
      getInventory(selectedStore.value);
    }
  }, [selectedStore]);

  useEffect(() => {
    if (selectedStore) {
      setTransaction((prevState) => ({
        ...prevState,
        store: {
          id: selectedStore.value,
          name: selectedStore.label,
        },
      }));
    }
  }, [selectedStore]);

  useEffect(() => {
    if (id) {
      getTransaction(id);
    }
  }, [id]);

  const getTransaction = async (id) => {
    const response = await api.get(`transaction/${id}`);
    if (response.ok) {
      setTransaction(response.data.data[0]);
      await getCustomerForTransaction(
        response.data.data[0].store.id,
        response.data.data[0].customer.id
      );
      setReceiptItems(response.data.data[0].inventory);
    }
  };

  console.log("transaction", transaction);

  useEffect(() => {
    let newTotal = receiptItems.reduce((totalPrice, item) => {
      return totalPrice + item.price * item.quantity;
    }, 0);

    setSubTotal(newTotal);

    let discount = newTotal * (discountP / 100);
    setDiscountAmount(discount);

    newTotal = newTotal - discount;

    let tax = newTotal * (taxEdit / 100);
    setTaxAmount(tax);

    const finalTotal = newTotal + tax;
    setTotalPrice(finalTotal);

    setTransaction((prev) => ({
      ...prev,
      inventory: receiptItems,
      discount: discount,
      Tax: tax,
      SubTotal: newTotal,
      TotalAmountPaid: finalTotal,
    }));
  }, [receiptItems, taxEdit, discountP]);

  const purchasedItem = [
    {
      id: "Item Name",
      name: "Item Name",
      selector: (row) => row.item,
      sortable: true,
      width: "40%",
      style: LEFT_ALIGN_WITH_BORDER,
    },
    {
      id: "Stock Number",
      name: "Stock Number",
      selector: (row) => row.sku,
      sortable: true,
      style: LEFT_ALIGN,
    },
    {
      id: "Quantity",
      name: "Quantity",
      cell: (row) => (
        <NumericInput
          min={1}
          max={row.max}
          className="form-control"
          value={row.quantity}
          onChange={(value) => adjustQuantity(row.sku, value, row.max)}
        />
      ),
      style: LEFT_ALIGN,
    },
    {
      id: "Price",
      name: "Price",
      selector: (row) => `${row.quantity} x ${row.price} `,
      sortable: true,
      style: LEFT_ALIGN,
    },

    {
      id: "Total",
      name: "Total",
      selector: (row) => row.quantity * row.price,
      sortable: true,
      style: LEFT_ALIGN,
    },

    {
      cell: (row) => {
        return (
          <>
            <div className="action-icons-edit-del">
              <span>
                <Link>
                  <AiFillDelete
                    onClick={() => {
                      removeItem(row.sku);
                    }}
                  />
                </Link>
              </span>
            </div>
          </>
        );
      },
      name: "",
      width: "8%",
      ignoreRowClick: true,
      allowOverflow: true,
      button: true,
      style: LEFT_ALIGN,
    },
  ];

  const updateQuantity = (sku, quantity) => {
    setReceiptItems((prevItems) =>
      prevItems.map((item) => {
        if (item.sku === sku) {
          const validQuantity = Math.min(
            item.maxQuantity,
            Math.max(1, quantity)
          );
          return { ...item, quantity: validQuantity };
        }
        return item;
      })
    );
  };

  const adjustQuantity = (sku, newValue, max) => {
    let adjustedValue = newValue;
    const itemInventory = inventory.find((item) => item.sku === sku);

    if (itemInventory) {
      if (newValue < 1) {
        adjustedValue = 1
      }
      if (newValue > max) {
        adjustedValue = max;
      }

      setReceiptItems((prevItems) =>
        prevItems.map((item) =>
          item.sku === sku ? { ...item, quantity: adjustedValue } : item
        )
      );
    }
  };

  const getCustomerForTransaction = async (storeId, cusId) => {
    if (storeId) {
      const response = await api.get(`store-customer/${storeId}`);
      console.log(response.data);

      if (response && response.ok) {
        const option = response.data.data.map((cust) => ({
          id: cust.id,
          custName: `${cust.firstName} ${cust.lastName}`,
          mobile: cust.mobile,
          credit: cust.currentBalance,
        }));
        setSelectedCustomer(option.find((op) => op.id === cusId));
        setCustomers(option);
      }
    }
  };

  const getCustomer = async (storeId) => {
    if (storeId && !id) {
      const response = await api.get(`store-customer/${storeId}`);
      console.log(response.data);

      if (response && response.ok) {
        const option = response.data.data.map((cust) => ({
          id: cust.id,
          custName: `${cust.firstName} ${cust.lastName}`,
          mobile: cust.mobile,
          credit: cust.currentBalance,
        }));

        setCustomers(option);
      }
    }
  };

  const loadOptions = (inputValue, callback) => {
    const filteredOptions = customers.filter((option) =>
      option.custName.toLowerCase().includes(inputValue.toLowerCase())
    );
    const selectOptions = filteredOptions.map((option) => ({
      value: option.id,
      label: option.custName,
    }));
    callback(selectOptions);
  };

  const getInventory = async (storeId) => {
    if (storeId) {
      const response = await api.get(`store-inventory/${storeId}?`);

      if (response && response.ok) {
        setInventory(response.data.data);
      }
    }
  };

  const loadOptionsInventory = (inputValue, callback) => {
    const selectOptions = inventory.filter((inv) => JSON.stringify(inv).toLowerCase().includes(inputValue.toLowerCase())).map((option) => ({
      value: option.product_id,
      label: `${option.product_id}/${option.category_name}/${option.product_name}/${option.price.type}`,
      category_name: option.category_name,
      sku: option.sku,
      quantity: option.price.quantity,
      price: option.price.unit_sell_price,
      cogs: option.price.unit_purchase_price,
      total: option.price.unit_sell_price * option.price.quantity,
    }));
    callback(selectOptions);
  };

  const addCart = (e) => {
    e.preventDefault();
    setReceiptItems((items) => {
      return [...items, addMisc];
    });

    handleClose("showAddMisc")();
  };

  const applyCredit = () => {
    setCredit(credit + selectedCustomer.credit);
    customers.credit = 0;
  };

  const countItems = () => {
    let count = receiptItems.reduce((totalQuant, itemQuant) => {
      return totalQuant + parseInt(itemQuant.quantity);
    }, 0);
    return count;
  };

  const removeItem = (sku) => {
    setReceiptItems((prevItems) =>
      prevItems.filter((item) => item.sku !== sku)
    );
  };

  const addItem = (newItem) => {
    const existingItem = receiptItems.find((item) => item.sku === newItem.sku);

    if (existingItem) {
      return alert("Item Already Added");
    } else {
      setReceiptItems((prevItems) => [...prevItems, newItem]);
    }

    closeSearch();
  };

  const getStores = async () => {
    const response = await api.get("get-store");
    if (response && response.ok) {
      const options = response.data.data.map((store) => ({
        value: store.id,
        label: store.storeName,
      }));

      setStores(options);
    }
  };

  const getTax = async (storeId) => {
    if (storeId) {
      const response = await api.get(`default-tax/${storeId}`);
      if (response && response.ok) {
        setTaxEdit(response.data.data);
        setOriginalTax(response.data.data);
      }
    }
  };

  const updateTax = async () => {
    const response = await api.put(`default-tax/${selectedStore}`, {
      defaultTax: taxEdit,
    });
    if (response && response.ok) {
      notificationSvc.success("Tax Updated Successfully");
      getTax(selectedStore);
      handleClose("tax")();
    }
  };

  const getDiscount = async (storeId) => {
    if (storeId) {
      const response = await api.get(`get-discount/${storeId}`);
      if (response && response.ok) {
        // setDiscountP(response.data.data);
        console.log("Discount", response.data);
      }
    }
  };

  const addTransaction = async (type, status) => {
    if (cusChecked && !selectedCustomer.id) {
      notificationSvc.error("Please select a customer")
      return;
    }
    if (receiptItems.length < 1) {
      notificationSvc.error("Please select at least one product")
      return;
    }
    let id = transaction.id;
    if (!id) {
      const ids = await api.get("get-transaction-id");
      id = ids.data.data;
    }
    const response = await api.post("add-transaction", {
      ...transaction,
      id: id,
      PaymentType: type,
      TransactionType: status,
      TotalAmountPaid: cusChecked ? (totalPrice - Number(totalPrice > Number(selectedCustomer.credit) ? selectedCustomer.credit : totalPrice || 0)).toFixed(2) : Number(totalPrice).toFixed(2),
      creditUsed: cusChecked ? Number(totalPrice > Number(selectedCustomer.credit) ? selectedCustomer.credit : totalPrice || 0).toFixed(2) : 0.00
    });
    if (response && response.ok) {
      notificationSvc.success("Transaction has been Successful.");
      navigate("/transaction-history");
    }
  };

  return (
    <main>
      <div className="container-fluid">
        <div className="row page-header mt-3">
          <div className="col-6">
            <h2 className="heading-main-page">New Sale</h2>
          </div>
        </div>
        <div className="row new-sale-receipt">
          <div className="col-12 col-sm-12 col-md-12 col-lg-4 col-xl-4 col-xxl-4 new-sale-customer">
            <div className="customer-sale">
              <h6 className="text-center customer-sale-new fw-bold">
                Customer&nbsp;&nbsp;&nbsp;
                <span>
                  <button onClick={handleShow("showCustomer")}>+</button>
                </span>
              </h6>

              <div className="show-cus-details" key={selectedCustomer.id}>
                <p>Name : {selectedCustomer.custName}</p>
                <p>Phone : {selectedCustomer.mobile || "Not Available"}</p>
                <p>Trade Credit : {selectedCustomer.credit || "0"} </p>
              </div>
            </div>

            <div className=" new-sale-main">
              <div className="mb-3">
                {isSearching ? (
                  <AsyncSelect
                    loadOptions={loadOptionsInventory}
                    placeholder="Search Inventory"
                    autoFocus
                    onChange={(selectedOption) => {
                      const totalValue =
                        selectedOption.quantity * selectedOption.price;

                      addItem({
                        category: selectedOption.category_name,
                        item: selectedOption.label,
                        sku: selectedOption.sku,
                        quantity: 1,
                        max: Number(selectedOption.quantity),
                        price: selectedOption.price,
                        cogs: selectedOption.cogs,
                      });
                    }}
                  />
                ) : (
                  <button
                    className="w-100 new-sale-action"
                    onClick={ShowSearch}
                  >
                    Add From Inventory
                  </button>
                )}
              </div>
              <div className="mb-3">
                <button
                  className="w-100 new-sale-action"
                  onClick={handleShow("showAddMisc")}
                >
                  Add Misc. Item
                </button>
              </div>
            </div>
          </div>

          <div className="col-12 col-sm-12 col-md-12 col-lg-8 col-xl-8 col-xxl-8 receipt-main">
            <h6 className="text-center fw-bold customer-sale-new">Receipt</h6>

            <div className="receipt-new-sale-main mt-3">
              <div className="recepit-item-purchased">
                <TableWare
                  json={receiptItems}
                  tableColumns={purchasedItem}
                  customStyles={datatableStyle}
                  paginationStyles={paginationStyle}
                  enableSearch={false}
                  loading={loading}
                  enablePagination={totalCount > pageSize}
                  pageIndex={pageIndex}
                  pageSize={pageSize}
                  totalCount={totalCount}
                  // onSearchChange={(str: any) => {
                  //   setPageIndex(1);
                  //   setSearchString(str);
                  // }}
                  onSortChange={(orderBy, orderByDir) => {
                    setPageIndex(1);
                    setOrderBy(orderBy);
                    setOrderByDir(orderByDir);
                  }}
                  onPageChange={setPageIndex}
                />
              </div>

              <div className="sales-actions">
                <div className="row discount">
                  <div className="col-6">
                    <p className="">SubTotal ({countItems()} items)</p>
                  </div>

                  <div className="col-6 ">
                    <p className="text-end">$ {Number(subTotal).toFixed(2)}</p>
                  </div>
                </div>
                <br />
                <div className="row discount">
                  <div className="col-6">
                    <p>
                      (Add Modal to Set Discount for Receipt Only) Discount (
                      {discountP}%)
                    </p>
                  </div>

                  <div className="col-6 ">
                    <p className="text-end">$ {discountAmount.toFixed(2)}</p>
                  </div>
                </div>

                <br />
                <div className="row discount">
                  <div className="col-6">
                    <p
                      className=""

                    // onClick={handleShow("tax")}
                    >
                      <label>
                        <Checkbox
                          defaultChecked
                          onChange={(e) => {
                            setTaxCheck(e.target.checked);
                            if (e.target.checked) {
                              setTaxEdit(originalTax);
                            } else {
                              setTaxEdit(0);
                            }
                          }}
                        />
                        &nbsp; Tax ({taxEdit}%)
                      </label>
                    </p>
                  </div>
                  <div className="col-6 text-right">
                    <p className="text-end">$ {taxAmount.toFixed(2)}</p>
                  </div>
                </div>

                <br />
                <div className="row discount">
                  <div className="col-6">
                    <p
                      className=""

                    // onClick={handleShow("tax")}
                    >
                      <label>
                        <Checkbox
                          value={cusChecked}
                          onChange={(e) => {
                            setCusChecked(e.target.checked);
                          }}
                        />
                        &nbsp; Apply customer credit
                      </label>
                    </p>
                  </div>
                  <div className="col-6 text-right">
                    <p className="text-end">$ {Number(totalPrice > Number(selectedCustomer.credit) ? selectedCustomer.credit : totalPrice || 0).toFixed(2) || 0.00}</p>
                  </div>
                </div>

                <br />

                <div className="row discount">
                  <div className="col-6">
                    <p>Net Total</p>
                  </div>
                  <div className="col-6">
                    <p className="text-end">$ {cusChecked ? (totalPrice - Number(totalPrice > Number(selectedCustomer.credit) ? selectedCustomer.credit : totalPrice || 0)).toFixed(2) : Number(totalPrice).toFixed(2)}</p>
                  </div>
                </div>
              </div>

              <br />

              <div className="sale-pay text-center">
                <button onClick={handleShow("showPay")}>Pay</button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/*1st Modal */}
      <Modal
        show={modal.showCustomer}
        size="lg"
        onHide={handleClose("showCustomer")}
        animation={true}
      >
        <Modal.Header closeButton>
          <Modal.Title>Add a Customer</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <AsyncSelect
            loadOptions={loadOptions}
            autoFocus
            onChange={(selectedOption) => {
              const custSelect = customers.find((customer) => {
                return customer.id === selectedOption.value;
              });
              setSelectedCustomer(custSelect);
              setTransaction((prevState) => ({
                ...prevState,
                customer: {
                  id: custSelect.id,
                  name: custSelect.custName,
                },
              }));
              handleClose("showCustomer")();
            }}
          />
        </Modal.Body>
      </Modal>
      {/*1st Modal */}
      {/* 2nd Modal */}
      <Modal show={modal.tax} onHide={handleClose("tax")} animation={true}>
        <Modal.Header closeButton>
          <Modal.Title>Edit Tax</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="mb-3">
            <label className="form-label">Edit Tax</label>
            <input
              type="text"
              className="form-control"
              value={taxEdit}
              onChange={(e) => {
                setTaxEdit(e.target.value);
              }}
            />
          </div>
        </Modal.Body>
        <Modal.Footer>
          <button onClick={handleClose("tax")} className="btn btn-danger">
            Close
          </button>
          <button
            onClick={() => {
              updateTax();
            }}
            className="btn btn-primary"
          >
            Update Tax
          </button>
        </Modal.Footer>
      </Modal>
      {/* 2nd Modal */}
      {/* 3rd Modal */}
      <Modal
        size="lg"
        show={modal.showPay}
        onHide={handleClose("showPay")}
        animation={true}
      >
        <Modal.Header closeButton>
          <Modal.Title>Payment</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {/* <div className="col-md-6 apply-credit">
              <p>
                Credit: <span>{credit}</span>
              </p>
              <p>
                Available Credit: <span>{selectedCustomer.credit}</span>
              </p>
              <button onClick={applyCredit}>Apply Credit</button>
            </div> */}

          <div className="no-of-items">
            <h5 className="text-center">Number of Items: {countItems()}</h5>
            <hr />

            <div className="row discount">
              <div className="col-6">
                <p className="">SubTotal ({countItems()} items)</p>
              </div>

              <div className="col-6 ">
                <p className="text-end">$ {subTotal}</p>
              </div>
            </div>
            <br />
            <div className="row discount">
              <div className="col-6">
                <p>
                  (Add Modal to Set Discount for Receipt Only) Discount (
                  {discountP}%)
                </p>
              </div>

              <div className="col-6 ">
                <p className="text-end">$ {discountAmount.toFixed(2)}</p>
              </div>
            </div>

            <br />
            <div className="row discount">
              <div className="col-6">
                <p
                  className=""

                // onClick={handleShow("tax")}
                >
                  <label>
                    <Checkbox
                      defaultChecked
                      onChange={(e) => {
                        setTaxCheck(e.target.checked);
                        if (e.target.checked) {
                          setTaxEdit(originalTax);
                        } else {
                          setTaxEdit(0);
                        }
                      }}
                    />
                    &nbsp; Tax ({taxEdit}%)
                  </label>
                </p>
              </div>
              <div className="col-6 text-right">
                <p className="text-end">$ {taxAmount.toFixed(2)}</p>
              </div>
            </div>

            <br />
            <div className="row discount">
              <div className="col-6">
                <p
                  className=""

                // onClick={handleShow("tax")}
                >
                  <label>
                    <Checkbox
                      value={cusChecked}
                      onChange={(e) => {
                        setCusChecked(e.target.checked);
                      }}
                    />
                    &nbsp; Apply customer credit
                  </label>
                </p>
              </div>
              <div className="col-6 text-right">
                <p className="text-end">$ {Number(totalPrice > Number(selectedCustomer.credit) ? selectedCustomer.credit : totalPrice || 0).toFixed(2) || 0.00}</p>
              </div>
            </div>
            <br />

            <div className="row discount">
              <div className="col-6">
                <p>Net Total</p>
              </div>
              <div className="col-6">
                <p className="text-end">$ {cusChecked ? (totalPrice - Number(totalPrice > Number(selectedCustomer.credit) ? selectedCustomer.credit : totalPrice || 0)).toFixed(2) : Number(totalPrice).toFixed(2)}</p>
              </div>
            </div>
          </div>

          <div className="row mt-3 payment-actions">
            <div className="col-12 col-sm-12 col-md-12 col-lg-4 col-xl-4 col-xxl-4">
              <button
                className="w-100"
                onClick={() => addTransaction("Cash", "Processed")}
              >
                Cash
              </button>
            </div>
            <div className="col-12 col-sm-12 col-md-12 col-lg-4 col-xl-4 col-xxl-4">
              <button
                className="w-100"
                onClick={() => addTransaction("Credit", "Processed")}
              >
                Credit
              </button>
            </div>
            <div className="col-12 col-sm-12 col-md-12 col-lg-4 col-xl-4 col-xxl-4">
              <button
                className="w-100"
                onClick={() => addTransaction("Cash", "Draft")}
              >
                Draft
              </button>
            </div>
            <div className="col-12 col-sm-12 col-md-12 col-lg-4 col-xl-4 col-xxl-4">
              <button className="w-100" onClick={handleClose("showPay")}>
                Cancel
              </button>
            </div>
          </div>
        </Modal.Body>
      </Modal>
      {/* 3rd Modal */}
      {/* 5th Modal */}
      <Modal
        show={modal.showAddMisc}
        size="lg"
        onHide={handleClose("showAddMisc")}
        animation={true}
      >
        <Modal.Header closeButton>
          <Modal.Title>Add Misc. Item</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <form
            className="row g-3"
            onSubmit={(e) => {
              addCart(e);
            }}
          >
            <div className="col-md-6">
              <label className="form-label">Item Description</label>
              <input
                type="text"
                className="form-control"
                onChange={(e) => {
                  setAddMisc({ ...addMisc, product_name: e.target.value });
                }}
              />
            </div>
            <div className="col-md-6">
              <label className="form-label">Price</label>
              <input
                type="text"
                className="form-control"
                onChange={(e) => {
                  setAddMisc({
                    ...addMisc,
                    price: e.target.value,
                  });
                }}
              />
            </div>
            <div className="col-6">
              <label className="form-label">Cost of Goods</label>
              <input
                type="text"
                className="form-control"
                onChange={(e) => {
                  setAddMisc({
                    ...addMisc,
                    cost: e.target.value,
                  });
                }}
              />
            </div>

            <div className="col-6">
              <label className="form-label">Quantity</label>
              <input
                type="text"
                className="form-control"
                onChange={(e) => {
                  setAddMisc({
                    ...addMisc,
                    quantity: e.target.value,
                  });
                }}
              />
            </div>

            <div className="col-12 text-end">
              <button
                type="submit"
                className="btn"
                style={{
                  backgroundColor: "#656565",
                  color: "#ffff",
                }}
              >
                Add to Cart
              </button>
            </div>
          </form>
        </Modal.Body>
      </Modal>
      {/* 5th Modal */}
    </main>
  );
};

export default NewSale;
