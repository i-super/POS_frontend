import React from "react";
import './ItemSold.css'
import Table from "../../../Components/Table/Table";
import DatePicker from "react-date-picker";
import Dropdown from "react-dropdown";
import "react-dropdown/style.css";

const ItemSold = () => {
  const itemSold = [
    {
      Header: "Title",
      accessor: "title",
    },
    {
      Header: "Location",
      accessor: "location",
    },
    {
      Header: "Cost",
      accessor: "cost",
    },
    {
      Header: "Sell Price",
      accessor: "sell_price",
    },
    {
      Header: "Discount",
      accessor: "discount",
    },
    {
      Header: "Net",
      accessor: "net",
    },
    {
      Header: "Action",
      accessor: "action",
    },
  ];
  const itemOptions = [
    {
      value: "by_category",
      label: "By Category",
    },
    {
      value: "by_store",
      label: "By Store",
    },
  ];
  const netOptions = [
    {
      value: "net",
      label: "Net",
    }
  ];
  return (
    <main>
      <div className="container-fluid">
        <h3>Items Sold</h3>

        <div className="row">
          <div className="table-responsive col-12 col-sm-12 col-md-12 col-lg-8 col-xl-8 col-xxl-8 item-sold-btntxt">
            <Table
              headers={itemSold}
              gridData={[{}, {}, {}]}
              pageSize={20}
              btnText="Export CSV"
            />
          </div>
          <div className="col-12 col-sm-12 col-md-12 col-lg-4 col-xl-4 col-xxl-4">
            <div className="date-choose">
              <DatePicker className={"w-100"} />
            </div>

            <div className="invet-glance">
              <h6>At a Glance</h6>

              <div className="row">
                <div className="col-md-6">
                  <Dropdown options={itemOptions} />
                </div>
                <div className="col-md-6">
                  <Dropdown options={netOptions} />
                </div>
              </div>

              <div className="items-list">
                <div className="invet-glance-item">
                  <div className="item-name">
                    <p>NES</p>
                    <span>Video Games</span>
                  </div>
                  <div className="items-price">
                    <p>$ 67.98</p>
                  </div>
                </div>
                <div className="invet-glance-item">
                  <div className="item-name">
                    <p>NES</p>
                    <span>Video Games</span>
                  </div>
                  <div className="items-price">
                    <p>$ 67.98</p>
                  </div>
                </div>

                <div className="invet-glance-item">
                  <div className="item-name">
                    <p>NES</p>
                    <span>Video Games</span>
                  </div>
                  <div className="items-price">
                    <p>$ 67.98</p>
                  </div>
                </div>
                <div className="invet-glance-item">
                  <div className="item-name">
                    <p>NES</p>
                    <span>Video Games</span>
                  </div>
                  <div className="items-price">
                    <p>$ 67.98</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default ItemSold;
