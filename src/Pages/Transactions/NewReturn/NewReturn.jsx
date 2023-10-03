import React, { useEffect, useState } from "react";
import Table from "../../../Components/Table/Table";
import "./NewReturn.css";
import { Button, Modal } from "react-bootstrap";
import { api } from "../../../Services/api-service";
import notificationSvc from "../../../Services/notification";
import { useNavigate } from "react-router-dom";
const NewReturn = () => {
  const navigate = useNavigate();
  const [transaction, setTransaction] = useState({ inventory: [] })
  const [search, setSearch] = useState("")
  const [total, setTotal] = useState(0)
  const [tax, setTax] = useState(0)
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const [showPay, setShowPay] = useState(false);
  const handlePayClose = () => setShowPay(false);
  const handlePayShow = () => setShowPay(true);
  const returnSales = [
    { Header: "Name", accessor: "item" },
    { Header: "Price", accessor: "price" },
    { Header: "Available", accessor: "quantity" },
    {
      Header: "Edit QTY",
      accessor: "edit_qty",
      Cell: (props) => {
        return (
          <input
            type="number"
            className="form-control"
            value={props.row.original.ret}
            max={props.row.original.quantity}
            min={0}
            onChange={(e) => decrement(props.row.original.sku, e.target.value)}
          />
        );
      },
    },
  ];

  const purchasedItem = [
    {
      Header: "Item",
      accessor: "item",
    },
    {
      Header: "Price",
      accessor: "price",
    },
    {
      Header: "Quantity",
      accessor: "ret",
    },
    {
      Header: "Total",
      accessor: "total",
      Cell: (props) => Number(props.row.original.price * props.row.original.ret).toFixed(2),
    },
  ];

  const getTransaction = async () => {
    const response = await api.get(`transaction/${search}`)
    if (response.ok) {
      const transaction = response.data.data[0].inventory.map((inv) => { return { ...inv, ret: inv.quantity } })
      let trans = { ...response.data.data[0], TransactionID: response.data.data[0].id, inventory: transaction }
      let Percentage = trans.Tax > 0 ? (trans.Tax / trans.SubTotal) : 0
      setTax(Number(Percentage))
      setTransaction(trans)
    }
  }

  const decrement = (id, num) => {
    const inv = transaction.inventory.map((inv) => {
      let temp = { ...inv }
      if (temp.sku === id) {
        temp.ret = num;
      } return temp;
    })
    setTransaction({ ...transaction, inventory: inv });
  }

  useEffect(() => {
    let tAmount = transaction.inventory.reduce((acc, inv) => acc + (inv.price * inv.ret), 0);
    let amount = tax > 0 ? tAmount + tAmount * tax : tAmount;
    setTotal(amount)
    setTransaction({ ...transaction, SubTotal: tAmount, TotalAmountPaid: amount })
  }, [transaction.inventory])

  const addReturn = async (type) => {
    const ids = await api.get("get-return-id");
    let tra = { ...transaction }
    delete tra.TransactionType
    delete tra.creditUsed

    let inv = transaction.inventory.map((inv) => {
      return {
        item: inv.item,
        price: inv.price,
        quantity: inv.ret,
        sku: inv.sku,
        category: inv.category,
        cogs: inv.cogs
      }
    })
    const response = await api.post("add-return", { ...tra, inventory: inv, id: ids.data.data, Tax: Number(tax * tra.SubTotal).toFixed(2), PaymentType: type });
    if (response && response.ok) {
      notificationSvc.success("Return has been Successful.");
      navigate("/inventory-history")
    }
  };

  const countItems = () => {
    let count = transaction.inventory.reduce((totalQuant, itemQuant) => {
      return totalQuant + parseInt(itemQuant.ret);
    }, 0);
    return count;
  };

  console.log(transaction)

  return (
    <><main>
      <div className="container-fluid">
        <h3>New Return</h3>
        <div className="row filter-transaction-history mt-3">
          <div className="col-12 col-sm-12 col-md-6 col-lg-3 col-xl-3 col-xxl-3">
            <input
              type="text"
              className="form-control"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Enter transaction id here"
            />
          </div>
          <div className="col-12 col-sm-12 col-md-6 col-lg-3 col-xl-3 col-xxl-3">
            <Button onClick={() => getTransaction()}>Search</Button>
          </div>
        </div>

        <div className="row">
          <div className="col-12 col-sm-12 col-md-6 col-lg-7 col-xl-7 col-xxl-7">
            <div className="table-responsive">
              <Table headers={returnSales} gridData={transaction.inventory} pageSize={10} />
            </div>
          </div>
          <div className="col-12 col-sm-12 col-md-6 col-lg-5 col-xl-5 col-xxl-5 receipt-main">
            <div className="">
              <h6 className="text-center customer-sale-new fw-bold">Receipt</h6>

              <div className="receipt-new-sale-main">
                <div className="recepit-item-purchased">
                  <Table
                    headers={purchasedItem}
                    gridData={transaction.inventory.filter((item) => item.ret > 0)}
                    pageSize={10000}
                  />
                </div>

                <div className="sales-actions">
                  <div className="row">
                    <div className="col-6">
                      <p className="discount">Discount</p>
                    </div>
                    <div className="col-6 ">
                      <p className="text-end" onClick={handleShow}>
                        $ 0.00
                      </p>
                    </div>
                  </div>

                  <div className="row">
                    <div className="col-6">
                      <p className="discount">{`Tax(${tax * 100}%)`}</p>
                    </div>
                    <div className="col-6 text-right">
                      <p className="text-end" onClick={handleShow}>
                        $ {Number(tax * transaction.SubTotal).toFixed(2)}
                      </p>
                    </div>
                  </div>

                  <div className="row">
                    <div className="col-6">
                      <p className="discount">Total</p>
                    </div>
                    <div className="col-6">
                      <p className="text-end">$ {Number(total).toFixed(2)}</p>
                    </div>
                  </div>
                </div>

                <div className="sale-pay text-center">
                  <button onClick={handleShow}>Pay</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
      <Modal
        size="lg"
        show={show}
        onHide={handleClose}
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
            <h5 className="text-center">Number of Items: {countItems()}</h5>
            <hr />

            <div className="row discount">
              <div className="col-6">
                <p className="">SubTotal ({countItems()} items)</p>
              </div>

              <div className="col-6 ">
                <p className="text-end">$ {transaction.SubTotal}</p>
              </div>
            </div>
            <br />
            <div className="row discount">
              <div className="col-6">
                <p>
                  Discount (0%)
                </p>
              </div>

              <div className="col-6 ">
                <p className="text-end">$ {0.00}</p>
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
                    &nbsp;{`Tax(${tax * 100}%)`}
                  </label>
                </p>
              </div>
              <div className="col-6 text-right">
                <p className="text-end">$ {Number(tax * transaction.SubTotal).toFixed(2)}</p>
              </div>
            </div>

            <br />

            <div className="row discount">
              <div className="col-6">
                <p>Net Total</p>
              </div>
              <div className="col-6">
                <p className="text-end">$ {Number(transaction.TotalAmountPaid).toFixed(2)}</p>
              </div>
            </div>
          </div>

          <div className="row mt-3 payment-actions">
            <div className="col-12 col-sm-12 col-md-12 col-lg-4 col-xl-4 col-xxl-4">
              <button className="w-100" onClick={() => addReturn("Cash")}>
                Cash
              </button>
            </div>
            <div className="col-12 col-sm-12 col-md-12 col-lg-4 col-xl-4 col-xxl-4" >
              <button className="w-100" onClick={() => addReturn("Credit")}>Credit</button>
            </div>

            <div className="col-12 col-sm-12 col-md-12 col-lg-4 col-xl-4 col-xxl-4">
              <button className="w-100" onClick={handleClose}>Cancel</button>
            </div>
          </div>
        </Modal.Body>
      </Modal></>
  );
};

export default NewReturn;
