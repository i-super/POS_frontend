import React, { useEffect, useState } from "react";
import Select from "react-select";
import { api } from "../../../Services/api-service";
import DatePicker from "react-date-picker";
import "react-datepicker/dist/react-datepicker.css";

const Discounts = () => {
  const [stores, setStores] = useState([]);

  const [dateRange, setDateRange] = useState([null, null]);

  console.log("Date range", dateRange);

  const getStores = async () => {
    const response = await api.get("get-store");
    if (response && response.ok) {
      console.log(response.data);

      const option = response.data.data.map((store) => {
        return {
          value: store.id,
          label: store.storeName,
        };
      });

      setStores(option);
    }
  };

  useEffect(() => {
    getStores();
  }, []);

  const selectionRange = {
    startDate: new Date(),
    endDate: new Date(),
    key: "selection",
  };

  return (
    <main>
      <div className="container-fluid">
        <h3>Discounts</h3>

        <div className="row">
          <div className="col-md-3">
            <div className="mb-3">
              <label className="form-label">Store</label>
              <Select options={stores} />
            </div>
          </div>
          <div className="col-md-3">
            <div className="mb-3">
              <label className="form-label">Set Discount Duration</label>
              <DatePicker
                selectRange
                value={dateRange}
                onChange={(e) => {
                  setDateRange(e);
                }}
              />
            </div>

            <p>Duration: </p>
          </div>
          <div className="col-md-3">
            <div className="mb-3">
              <label className="form-label">Global Trade Percentage</label>
              <input type="text" className="form-control" placeholder="" />
            </div>

            <p>Trade Percent: </p>
          </div>
          <div className="col-md-3">
            <div className="mb-3">
              <label className="form-label">
                Trade Percentage for Category
              </label>
              <input type="text" className="form-control" placeholder="" />
            </div>

            <p>Trade Percent: </p>
          </div>
        </div>
      </div>
    </main>
  );
};

export default Discounts;
