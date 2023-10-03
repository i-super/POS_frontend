import React, { useEffect, useState } from "react";
import Modal from "react-bootstrap/Modal";
import Table from "../../../Components/Table/Table";
import AsyncSelect from "react-select/async";
import Select from "react-select";
import "./NewTrade.css";
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
import { Link, useNavigate } from "react-router-dom";
import NumericInput from "react-numeric-input";
import Checkbox from "rc-checkbox";
import axios from "axios";
import { useContext } from "react";
import { StoreContext } from "../../../Components/StoreContext";
import { Button, ButtonGroup, ToggleButton, ToggleButtonGroup } from "react-bootstrap";
import EditTax from "../../../Components/EditTax";

const NewTrade = () => {
  const { selectedStore } = useContext(StoreContext);
  const navigate = useNavigate()
  const [customers, setCustomers] = useState([]);
  const [product, setProduct] = useState({});
  const [selectedCustomer, setSelectedCustomer] = useState({});
  const [receiptItems, setReceiptItems] = useState([]);
  const [addMisc, setAddMisc] = useState({
    product_name: "",
    price: "",
    quantity: "",
    cost: "",
  });
  const [credit, setCredit] = useState("");
  const [totalPrice, setTotalPrice] = useState(0.0);
  const [taxEdit, setTaxEdit] = useState(0);
  const [discountP, setDiscountP] = useState(0);
  const [formData, setFormData] = useState({
    product_id: "",
    product_name: "",
    category_name: "",
    sku: "",
    date_added: "",
    price: {
      unit_purchase_price: 0,
      unit_sell_price: 0,
      quantity: 0,
      type: "",
    },
  });
  const [modal, setModal] = useState({
    showCustomer: false,
    showPay: false,
    showInventory: false,
    showAddMisc: false,
    tax: false,
    showTrade: false,
    addProduct: false,
  });
  const [discountAmount, setDiscountAmount] = useState(0);
  const [taxAmount, setTaxAmount] = useState(0);
  const [stores, setStores] = useState([]);
  const [storeSelected, setStoreSelected] = useState({});
  const [loading, setLoading] = useState(false);
  const [isChecked, setIsChecked] = useState(true);
  const [orderBy, setOrderBy] = useState(null);
  const [orderByDir, setOrderByDir] = useState(null);
  const [pageIndex, setPageIndex] = useState(1);
  const [pageSize, setPageSize] = useState(20);
  const [searchString, setSearchString] = useState("");
  const [totalCount, setTotalCount] = useState(0);
  const [isSearching, setIsSearching] = useState(false);
  const [selectedValue, setSelectedValue] = useState('Complete In Box');

  const [data, setData] = useState([
    {
      type: "Standard Margin",
      trade: formData.price.unit_sell_price * 0.3,
      cash: formData.price.unit_sell_price * 0.24
    },
    {
      type: "Global Percentage",
      trade: formData.price.unit_sell_price * selectedStore?.GlobalTradePercentage || 0,
      cash: formData.price.unit_sell_price * selectedStore?.GlobalTradePercentage
    },
    {
      type: "Category Percentage",
      trade: selectedStore?.categoryPercentage?.find((c) => c.category === product["console-name"])?.percentage || 0,
      cash: selectedStore?.categoryPercentage?.find((c) => c.category === product["console-name"])?.percentage || 0
    }
  ])
  const [selectedOption, setSelectedOption] = useState('Credit');

  console.log(selectedOption)

  const handleChange = (value) => {
    setSelectedOption(value);
  };

  const handleRadioChange = (event) => {
    setSelectedValue(event.target.value);
    handleProductGet(product, event.target.value)
  };


  const handleSaleFor = (value) => {
    setFormData({ ...formData, price: { ...formData.price, unit_sell_price: value } });
  }


  const ShowSearch = () => {
    setIsSearching(true);
  };

  const closeSearch = () => {
    setIsSearching(false);
  };

  const [inventory, setInventory] = useState([]);
  const [transaction, setTransaction] = useState({
    store: {
      id: "",
      name: "",
    },
    customer: {
      name: "",
      id: "",
    },
    inventory: [],
    discount: 0,
    Tax: 0,
    SubTotal: "",
    TotalAmountPaid: "",
  });

  useEffect(() => {
    let tempData = { ...data }
    tempData = data.map((dt) => {
      let temp = { ...dt };
      if (temp.type === "Global Percentage") {
        temp.trade = Number(formData.price.unit_sell_price * (selectedStore?.GlobalTradePercentage / 100)).toFixed(2);
        temp.cash = Number(formData.price.unit_sell_price * (selectedStore?.GlobalTradePercentage / 100)).toFixed(2);
      }
      else if (temp.type === "Standard Margin") {
        temp.trade = Number(formData.price.unit_sell_price * 0.3).toFixed(2);
        temp.cash = Number(formData.price.unit_sell_price * 0.24).toFixed(2);
      }
      else if (temp.type === "Category Percentage") {
        temp.trade = selectedStore?.categoryPercentage?.find((c) => c.category === product["console-name"])?.percentage / 100 * formData.price.unit_sell_price || 0;
        temp.cash = selectedStore?.categoryPercentage?.find((c) => c.category === product["console-name"])?.percentage / 100 * formData.price.unit_sell_price || 0;
      }
      return temp;
    });
    setData(tempData)
  }, [selectedStore, formData.price.unit_sell_price])

  const handleClose = (key) => () =>
    setModal((prevState) => ({ ...prevState, [key]: false }));
  const handleShow = (key) => () =>
    setModal((prevState) => ({ ...prevState, [key]: true }));

  useEffect(() => {
    getStores();
    if (selectedStore) {
      getCustomer(selectedStore.value)
    }
  }, [selectedStore]);

  const handleAddProductToInventory = async () => {
    let data = { ...formData }
    data.date_added = formatDate(new Date())
    if (!data.sku) {
      const sku = await api.get("get-sku");
      data.sku = sku.data.data
    }
    if (!data.price.quantity > 0) {
      data.price.quantity = 1;
    }
    if (data.store) {
      delete data.store;
    }
    let inventory = transaction.inventory || [];
    inventory.push(data)
    setTransaction({ ...transaction, inventory: [...inventory] })
    setFormData({
      product_id: "",
      product_name: "",
      category_name: "",
      sku: "",
      date_added: "",
      price: {
        unit_purchase_price: 0,
        unit_sell_price: 0,
        quantity: 0,
        type: "",
      }
    })
    handleClose("addProduct")()
  }
  const handleAddProductMisc = async () => {
    let data = { ...formData }
    data.date_added = formatDate(new Date())
    data.category_name = "Miscellaneous"
    if (!data.sku) {
      const sku = await api.get("get-sku");
      data.sku = sku.data.data
    }
    if (!data.price.quantity > 0) {
      data.price.quantity = 1;
    }
    let inventory = transaction.inventory || [];
    inventory.push(data)
    setTransaction({ ...transaction, inventory: [...inventory] })
    setFormData({
      product_id: "",
      product_name: "",
      category_name: "",
      sku: "",
      date_added: "",
      price: {
        unit_purchase_price: 0,
        unit_sell_price: 0,
        quantity: 0,
        type: "",
      }
    })
    handleClose("addProduct")()
  }

  // useEffect(() => {
  //   getTax(storeSelected.id);
  //   getDiscount(storeSelected.id);
  //   getCustomer(storeSelected.id);
  //   getInventory(storeSelected.id);
  // }, [storeSelected]);

  const handleProductGet = async (product, type) => {
    const response = await api.get(`/product?id=${product.id}&type=${type}`);
    if (response.ok) {
      setFormData({ ...response.data.data[0] });
    } else {
      setFormData({
        product_id: product.id,
        product_name: product['product-name'],
        category_name: product["console-name"],
        sku: "",
        date_added: "",
        price: {
          unit_purchase_price: 0,
          unit_sell_price: 0,
          quantity: 0,
          type: "Complete In Box",
        }
      })
    }
  }

  const addTrade = async () => {
    const ids = await api.get("get-trade-id");
    const response = await api.post("/add-trade", { ...transaction, id: ids.data.data, PaymentType: selectedOption, store: { id: selectedStore.value, name: selectedStore.label } });
    if (response.ok) {
      navigate("/inventory-history")
    }
  }

  const formatDate = (date) => {
    const day = ("0" + date.getDate()).slice(-2);
    const month = ("0" + (date.getMonth() + 1)).slice(-2);
    const year = date.getFullYear();

    return `${month}/${day}/${year}`;
  };

  const typeItem = [
    {
      Header: "Type",
      accessor: "type",
    },
    {
      Header: "Trade",
      accessor: "trade",
      Cell: (props) => props.row.original.trade > 0 ? <p>$ {props.row.original.trade}</p> : 0.00

    },
    {
      Header: "Cash",
      accessor: "cash",
      Cell: (props) => props.row.original.cash > 0 ? <p>$ {props.row.original.cash}</p> : 0.00

    },
  ]

  const purchasedItem = [
    {
      id: "Item Name",
      name: "Item Name",
      selector: (row) => row.product_name,
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
          className="form-control"
          value={row.price.quantity}
          onChange={(value) => updateQuantity(row.sku, value)}
        />
      ),
      style: LEFT_ALIGN,
    },
    {
      id: "Price",
      name: "Price",
      selector: (row) => `${row.price.quantity} x ${selectedOption === "Credit" ? row.price.unit_sell_price : row.price.unit_sell_price * 0.8} `,
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
                      removeProduct(row.sku);
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

  useEffect(() => {
    setTransaction({ ...transaction, SubTotal: transaction.inventory.reduce((a, b) => a + (b.price.quantity * (selectedOption === "Credit" ? b.price.unit_sell_price : b.price.unit_sell_price * 0.8)), 0.00), TotalAmountPaid: transaction.inventory.reduce((a, b) => a + (b.price.quantity * (selectedOption === "Credit" ? b.price.unit_sell_price : b.price.unit_sell_price * 0.8)), 0.00) })
  }, [transaction.inventory, selectedOption])

  console.log(transaction)

  const adjustQuantity = (sku, newValue) => {
    let adjustedValue = newValue;
    const itemInventory = inventory.find((item) => item.sku === sku);

    if (itemInventory) {
      if (newValue < 1) {
        adjustedValue = 1;
      } else if (newValue > itemInventory.quantity) {
        adjustedValue = itemInventory.quantity;
      }

      setReceiptItems((prevItems) =>
        prevItems.map((item) =>
          item.sku === sku ? { ...item, quantity: adjustedValue } : item
        )
      );
    }
  };

  const getCustomer = async (storeId) => {
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

        setCustomers(option);
      }
    }
  };

  const loadOptions = (inputValue, callback) => {
    const filteredOptions = customers.filter((option) =>
      option.custName.toLowerCase().includes(inputValue.toLowerCase())
    );
    const selectOptions = filteredOptions.map((option) => ({
      ...option,
      value: option.id,
      label: option.custName,
    }));
    callback(selectOptions);
  };

  const getInventList = async (query) => {
    const response = await axios.get(
      `https://www.pricecharting.com/api/products?t=be026bb3efdf1c0891fc044277d53e2f46a5ab45&q=${query}`
    );
    if (response.status === 200) {
      const products = response.data.products.map((product) => ({
        ...product,
        consoleName: product["console-name"],
        productName: product["product-name"],
      }));
      return products;
    }
  };

  const loadOptionsInventory = (inputValue, callback) => {
    getInventList(inputValue).then((options) => {
      const selectOptions = options.map((option) => ({
        ...option,
        value: option.id,
        label: (
          <div className="invent-display">
            <h5 className="category">{option.consoleName} </h5>
            &nbsp;
            <h5 className="product pt-2">{option.productName}</h5>
          </div>
        ),
      }));
      callback(selectOptions);
    });
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
      }
    }
  };

  const convertToUsd = (number) => {
    return (number / 100).toFixed(2);
  };

  const updateQuantity = (sku, quantity) => {
    let inv = transaction.inventory.map((ivn) => {
      let temp = { ...ivn };
      if (temp.sku === sku) {
        temp.price.quantity = quantity
      }
      return temp;
    });
    setTransaction({ ...transaction, inventory: inv })
  }

  const removeProduct = (sku) => {
    let inv = transaction.inventory.filter((ivn) => ivn.sku !== sku);
    setTransaction({ ...transaction, inventory: inv })
  }

  const getDiscount = async (storeId) => {
    if (storeId) {
      const response = await api.get(`get-discount/${storeId}`);
      if (response && response.ok) {
        // setDiscountP(response.data.data);
        console.log(response.data);
      }
    }
  };

  // const addTransaction = async () => {
  //   const response = await api.post("add-transaction", transaction);
  //   if (response && response.ok) {
  //     notificationSvc.success("Transaction has been Successful.");
  //   }
  // };

  return (
    <main>
      <div className="container-fluid">
        <div className="row page-header mt-3">
          <div className="col-md-3">
            <h2 className="heading-main-page">New Trade</h2>
          </div>

          <div className="col-md-3">
            <Select
              options={stores}
              placeholder="Select Store"
              onChange={(e) => {
                setStoreSelected({ ...e, id: e.value, name: e.label });
                setTransaction((prevState) => ({
                  ...prevState,
                  store: {
                    id: e.value,
                    name: e.label,
                  },
                }));
              }}
            />
          </div>
          <div className="col-md-3">
            <Select options={stores} placeholder="Select Type" />
          </div>
          <div className="col-md-3">
            <Select options={stores} placeholder="Select Category" />
          </div>
        </div>
        <div className="row new-sale-receipt">
          <div className="col-12 col-sm-12 col-md-12 col-lg-6 col-xl-6 col-xxl-6 new-sale-customer">
            <div className="customer-sale">
              <h6 className="text-center customer-sale-new fw-bold">
                Customer&nbsp;&nbsp;&nbsp;
                <span>
                  <button onClick={handleShow("showCustomer")}>+</button>
                </span>
              </h6>

              <div className="show-cus-details" key={selectedCustomer.id}>
                <p>Name : {selectedCustomer.custName}</p>
                <p>Phone : {selectedCustomer.mobile}</p>
                <p>Trade Credit :{selectedCustomer.credit} </p>
              </div>
            </div>

            <div className=" new-sale-main">
              <div className="mb-3">
                {isSearching ? (
                  <AsyncSelect
                    loadOptions={loadOptionsInventory}
                    placeholder="Search Inventory"
                    onChange={(product) => {
                      setProduct(product)
                      handleShow("addProduct")()
                      handleProductGet(product, "Complete In Box")
                      setFormData({
                        ...formData,
                        product_id: product["id"],
                        product_name: product["product-name"],
                        category_name: product["console-name"],
                      });
                      closeSearch();
                    }}
                  />
                ) : (
                  <button
                    className="w-100 new-sale-action"
                    onClick={ShowSearch}>
                    Add Trade
                  </button>
                )}
              </div>
              <div className="mb-3">
                <button
                  className="w-100 new-sale-action"
                  onClick={handleShow("showAddMisc")}>
                  Add Misc. Trade
                </button>
              </div>

              {/* <div className="mb-3">
                <button
                  className="w-100 new-sale-action"
                  onClick={handleShow("showTrade")}>
                  Add Trade
                </button>
              </div> */}
            </div>
          </div>

          <div className="col-12 col-sm-12 col-md-12 col-lg-6 col-xl-6 col-xxl-6 receipt-main">
            <div style={{ textAlign: "end" }}>
              <ButtonGroup className="mb-2" style={{ textAlign: "end" }} onChange={(e) => setSelectedOption(e.target.value)}>
                <ToggleButton
                  id="Cash"
                  type="radio"
                  variant="outline-secondary"
                  name="radio"
                  value={"Cash"}
                  checked={selectedOption === "Cash"}
                  onChange={(e) => setSelectedOption(e.currentTarget.value)}
                >Cash</ToggleButton>
                <ToggleButton
                  id="Credit"
                  type="radio"
                  variant="outline-secondary"
                  name="radio"
                  value={"Credit"}
                  checked={selectedOption === "Credit"}
                  onChange={(e) => setSelectedOption(e.currentTarget.value)}
                >Credit</ToggleButton>
              </ButtonGroup></div>
            <h6 className="text-center fw-bold customer-sale-new">Receipt</h6>

            <div className="receipt-new-sale-main mt-3">
              <div className="recepit-item-purchased">
                <TableWare
                  json={transaction.inventory}
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
                <div className="row">
                  <div className="col-6">
                    <p className="discount">SubTotal ({transaction.inventory.length} items)</p>
                  </div>

                  <div className="col-6 ">
                    <p className="text-end">$ {Number(transaction.SubTotal).toFixed(2)}</p>
                  </div>
                </div>

                <div className="row">
                  <div className="col-6">
                    <p className="discount">Net Total</p>
                  </div>
                  <div className="col-6">
                    <p className="text-end">$ {Number(transaction.TotalAmountPaid).toFixed(2)}</p>
                  </div>
                </div>
              </div>

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
        animation={true}>
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
      <EditTax show={modal.tax} onHide={() => handleClose("tax")} />
      {/* 2nd Modal */}
      {/* 3rd Modal */}
      <Modal
        size="lg"
        show={modal.showPay}
        onHide={handleClose("showPay")}
        animation={true}>
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
            <h5 className="text-center">Number of Items: {transaction.inventory.length}</h5>
            <hr />
            {/* 
              <div className="row">
                <div className="col-6 discount">Subtotal:</div>
                <div className="col-6 text-end">$ 134.99</div>
              </div> */}
            {/* <div className="row">
                <div className="col-6 discount">Tax: ({taxEdit}%) </div>
                <div className="col-6 text-end">$ {taxAmount.toFixed(2)}</div>
              </div>
              <div className="row">
                <div className="col-6 discount">Total:</div>
                <div className="col-6 text-end">$ {totalPrice.toFixed(2)}</div>
              </div> */}

            <div className="row">
              <div className="col-6">
                <p className="discount">SubTotal ({transaction.inventory.length} items)</p>
              </div>

              <div className="col-6 ">
                <p className="text-end">$ {Number(transaction.SubTotal)}</p>
              </div>
            </div>

            <div className="row">
              <div className="col-6">
                <p className="discount">Net Total</p>
              </div>
              <div className="col-6">
                <p className="text-end">$ {Number(transaction.TotalAmountPaid).toFixed(2)}</p>
              </div>
            </div>
            <div className="row">
              <div className="col-6">
                <p className="discount">Transaction Type</p>
              </div>
              <div className="col-6">
                <p className="text-end">{selectedOption}</p>
              </div>
            </div>
          </div>

          <div className="row mt-3 payment-actions">
            <div className="col-12 col-sm-12 col-md-12 col-lg-6 col-xl-6 col-xxl-6">
              <button onClick={() => addTrade()} className="w-100">Pay</button>
            </div>
            <div className="col-12 col-sm-12 col-md-12 col-lg-6 col-xl-6 col-xxl-6">
              <button className="w-100">Cancel</button>
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
        animation={true}>
        <Modal.Header closeButton>
          <Modal.Title>Add Misc. Item</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <form
            className="row g-3"
            onSubmit={(e) => {
              e.preventDefault();
              handleAddProductMisc();
            }}>
            <div className="col-md-6">
              <label className="form-label">Product ID</label>
              <input
                type="text"
                value={formData.product_id}
                className="form-control"
                required
                onChange={(e) => {
                  setFormData({ ...formData, product_id: e.target.value });
                }}
              />
            </div>
            <div className="col-md-6">
              <label className="form-label">Product Name</label>
              <input
                type="text"
                value={formData.product_name}
                required
                className="form-control"
                onChange={(e) => {
                  setFormData({ ...formData, product_name: e.target.value });
                }}
              />
            </div>
            <div className="col-md-6">
              <label className="form-label">Price</label>
              <input
                type="number"
                min={0}
                required
                className="form-control"
                value={formData.price.unit_sell_price}
                onChange={(e) => {
                  setFormData({
                    ...formData,
                    price: { ...formData.price, unit_sell_price: e.target.value },
                  });
                }}
              />
            </div>
            <div className="col-6">
              <label className="form-label">Cost of Goods</label>
              <input
                type="number"
                required
                min={0}
                className="form-control"
                value={formData.price.unit_purchase_price}
                onChange={(e) => {
                  setFormData({
                    ...formData,
                    price: { ...formData.price, unit_purchase_price: e.target.value },
                  });
                }}
              />
            </div>

            <div className="col-6">
              <label className="form-label">Type</label>
              <Select
                options={["New", "Complete In Box", "Loose"].map((op) => { return { label: op, value: op } })}
                value={{ label: formData.price.type, value: formData.price.type }}
                onChange={(e) => {
                  setFormData({
                    ...formData,
                    price: { ...formData.price, type: e.value },
                  });
                }}
              />
            </div>
            <div className="col-6">
              <label className="form-label">Quantity</label>
              <input
                type="number"
                required
                value={formData.price.quantity}
                className="form-control"
                onChange={(e) => {
                  setFormData({
                    ...formData,
                    price: { ...formData.price, quantity: e.target.value },
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
                }}>
                Add to Cart
              </button>
            </div>
          </form>
        </Modal.Body>
      </Modal>
      {/* 5th Modal */}
      {/* 6th Modal */}
      <Modal
        show={modal.showTrade}
        size="lg"
        onHide={handleClose("showTrade")}
        animation={true}>
        <Modal.Header closeButton>
          <Modal.Title>Add Trade</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <AsyncSelect
            loadOptions={loadOptionsInventory}
            onChange={(selectedOption) => {
              addItem({
                id: selectedOption.value,
                category_name: selectedOption.category_name,
                product_name: selectedOption.label,
                sku: selectedOption.sku,
                quantity: selectedOption.quantity,
                price: selectedOption.price,
                // total: selectedOption.quantity * selectedOption.price,
              });
              handleClose("showTrade")();
            }}
          />
        </Modal.Body>
      </Modal>
      <Modal
        show={modal.addProduct}
        size="lg"
        onHide={handleClose("addProduct")}
        animation={true}>
        <Modal.Header closeButton>
          <Modal.Title>Add Trade</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="container-fluid">
            <div className="row mt-3">
              <div className="col-6">
                <h3 className="option-invent">Console</h3>
                <h4 className="option-result">{product["console-name"]}</h4>
              </div>
              <div className="col-6 text-end  ">
                <h3 className="option-invent">Product</h3>
                <h4 className="option-result">{product["product-name"]}</h4>
              </div>
            </div>
            <hr />

            <div className="row mt-3">
              <div className="col-md-4 option-list">
                <h5 className="option-name">Stock Number (SKU)</h5>
                <p className="option-value">
                  {formData.sku ? formData.sku : "Auto-Generated"}
                </p>
              </div>
              <div className="col-md-4 option-list">
                <h5 className="option-name">Competitor Sell Price</h5>
                <p className="option-value">{`${convertToUsd(
                  product["gamestop-price"]
                )} $`}</p>
              </div>
              <div className="col-md-4 option-list">
                <h5 className="option-name">Competitor Buy Price</h5>
                <p className="option-value">{`${convertToUsd(
                  product["gamestop-trade-price"]
                )} $`}</p>
              </div>
            </div>
            <div className="form-group row">
              <div className="form-check col-md-4 form-check-inline">
                <input
                  className="form-check-input"
                  type="radio"
                  name="radioOptions"
                  id="newRadio"
                  value="New"
                  checked={selectedValue === 'New'}
                  onChange={handleRadioChange}
                />
                <label className="form-check-label" htmlFor="newRadio">
                  New
                </label>
              </div>

              <div className="form-check col-md-4 form-check-inline">
                <input
                  className="form-check-input"
                  type="radio"
                  name="radioOptions"
                  id="completeInBoxRadio"
                  value="Complete In Box"
                  checked={selectedValue === 'Complete In Box'}
                  onChange={handleRadioChange}
                />
                <label className="form-check-label" htmlFor="completeInBoxRadio">
                  Complete In Box
                </label>
              </div>

              <div className="form-check col-md-3 form-check-inline">
                <input
                  className="form-check-input"
                  type="radio"
                  name="radioOptions"
                  id="looseRadio"
                  value="Loose"
                  checked={selectedValue === 'Loose'}
                  onChange={handleRadioChange}
                />
                <label className="form-check-label" htmlFor="looseRadio">
                  Loose
                </label>
              </div>
            </div>

            <div className="row mt-3">
              <div className="col-md-4 option-list">
                <h5 className="option-name">Market Price</h5>
                <p className="option-value">
                  {selectedValue === "New" ? convertToUsd(product["new-price"]) : selectedValue === "Complete In Box" ? convertToUsd(product["cib-price"]) : convertToUsd(product["loose-price"])}$
                </p>
              </div>
              <div className="col-md-4 option-list">
                <h5 className="option-name">Suggested Sell Price</h5>
                <p className="option-value">
                  {selectedValue === "New" ? convertToUsd(product["retail-new-sell"]) : selectedValue === "Complete In Box" ? convertToUsd(product["retail-cib-sell"]) : convertToUsd(product["retail-loose-sell"])}$

                </p>
              </div>
              <div className="col-md-4 option-list">
                <h5 className="option-name">Suggested Buy Price</h5>
                <p className="option-value">
                  {selectedValue === "New" ? convertToUsd(product["retail-new-buy"]) : selectedValue === "Complete In Box" ? convertToUsd(product["retail-cib-buy"]) : convertToUsd(product["retail-loose-buy"])}$
                </p>
              </div>
            </div>
            <div className="row mt-3">
              <div className="col-md-3 option-list">
                Will sell for
              </div>
              <div className="col-md-9">
                <input
                  type="text"
                  className="form-control"
                  value={formData.price.unit_sell_price}
                  // value={search}
                  onChange={(e) => handleSaleFor(e.target.value)}
                  placeholder="Will sell for"
                />
              </div>
              <div className="col-md-2">
                Trade for
              </div>
              <div className="col-md-4">
                <input
                  type="number"
                  min={0}
                  className="form-control"
                  value={formData.price.unit_purchase_price}
                  onChange={(e) => setFormData({ ...formData, price: { ...formData.price, unit_purchase_price: e.target.value } })}
                  placeholder="Will sell for"
                />
              </div>
              <div className="col-md-2">
                Cash for
              </div>
              <div className="col-md-4">
                <input
                  type="text"
                  className="form-control"
                  value={formData.price.unit_purchase_price > 0 ? Number(formData.price.unit_purchase_price * 0.80).toFixed(2) : ""}
                  onChange={(e) => setFormData({ ...formData, price: { ...formData.price, unit_purchase_price: e.target.value * 1.25 } })}
                  // value={search}
                  placeholder="Will sell for"
                />
              </div>
              <div className="col-md-12">
                <Table
                  gridData={data.filter((dta) => Number(dta.trade) > 0 && Number(dta.cash) > 0)}
                  headers={typeItem}
                  pageSize={9999}
                />
              </div>
              <div className="col-md-12" style={{ textAlign: "end" }}>
                <Button onClick={() => handleAddProductToInventory()}>Add Product</Button>
              </div>
            </div>

          </div>
        </Modal.Body>
      </Modal>
      {/* 6th Modal */}
    </main>
  );
};

export default NewTrade;
