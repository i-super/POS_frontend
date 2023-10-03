import React from "react";
import Table from "../../../Components/Table/Table";
import "./EditPrice.css";
const EditPrice = () => {
  const editPrice = [
    {
      Header: "Tick",
      accessor: "tick",
    },
    {
      Header: "Stock Number",
      accessor: "stock_number",
    },
    {
      Header: "Quantity",
      accessor: "quantity",
    },
    {
      Header: "Our Price",
      accessor: "our_price",
    },
    {
      Header: "Competitor Price",
      accessor: "competitor_price",
    },
  ];
  return (
    <main>
      <div className="container-name">
        <h3>Pricing</h3>

        <div className="item-title">
          <h1>Alone in the Dark 2</h1>
          <p>Video Games / 3DO - Complete in Box</p>
        </div>

        <div className="row mt-3">
          <div className="col-md-8">
            <div className="table-responsive">
              <Table
                headers={editPrice}
                pageSize={20}
                gridData={[{}, {}, {}]}
              />
            </div>
          </div>
          <div className="col-md-4 specify-price">
            <p className="text-muted text-center">Specify a new price</p>

            <div className="input-group mb-3">
              <input
                type="text"
                className="form-control"
                placeholder=""
                aria-describedby="basic-addon2"
              />
              <button className="input-group-text" id="basic-addon2">
                Research Pricing
              </button>
            </div>

            <div className="form-check">
              <input
                className="form-check-input"
                type="checkbox"
                id="gridCheck"
              />
              <label className="form-check-label" htmlFor="gridCheck">
                Print Media Label
              </label>
            </div>
            <div className="form-check">
              <input
                className="form-check-input"
                type="checkbox"
                id="gridCheck"
              />
              <label className="form-check-label" htmlFor="gridCheck">
                Print Box Label
              </label>
            </div>
            <div
              className="mt-3">
              <button className="btn">Save</button>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default EditPrice;
