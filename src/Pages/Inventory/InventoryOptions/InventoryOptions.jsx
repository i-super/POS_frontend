import React, { useContext, useEffect, useState } from "react";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import Select from "react-select";
import { api } from "../../../Services/api-service";
import notificationSvc from "../../../Services/notification";
import { StoreContext } from "../../../Components/StoreContext";

const InventoryOptions = () => {
  const [product, setProduct] = useState({});
  const [getAStore, setGetAStore] = useState([]);

  const [formData, setFormData] = useState({
    product_id: "",
    product_name: "",
    category_name: "",
    sku: "",
    store: {
      id: "",
      name: "",
    },
    date_added: "",
    price: {
      unit_purchase_price: 0,
      unit_sell_price: 0,
      quantity: 0,
      type: "",
    },
  });

  const { selectedStore } = useContext(StoreContext);

  console.log("Inventory Data", formData);

  const route = useLocation();
  const { id } = useParams();
  const navigation = useNavigate();

  const itemOptions = [
    {
      value: "new",
      label: "New",
    },
    {
      value: "completeInBoxPrice",
      label: "Complete In Box",
    },
    {
      value: "loosePrice",
      label: "Loose",
    },
  ];

  useEffect(() => {
    getStores();
    setFormData({
      ...formData,
      product_id: product["id"],
      product_name: product["product-name"],
      category_name: product["console-name"],
      store: {
        id: selectedStore.value,
        name: selectedStore.label,
      }
    });
  }, [product, selectedStore]);
  useEffect(() => {
    if (id && route.pathname == `/edit-inventory/${id}`) {
      getInventorybyId();
    }
    productInfo();
  }, []);

  const productInfo = async () => {
    const response = await axios.get(
      `https://www.pricecharting.com/api/product?t=be026bb3efdf1c0891fc044277d53e2f46a5ab45&id=${id}`
    );

    if (response.status === 200) {
      setProduct({ ...response.data });
      console.log("Product Info", response.data);
    }
  };

  const getStores = async () => {
    const response = await api.get("get-store");
    if (response && response.ok) {
      const options = response.data.data.map((store) => {
        return { value: store.id, label: store.storeName };
      });

      setGetAStore(options);
    }
  };

  const convertToUsd = (number) => {
    return (number / 100).toFixed(2);
  };

  const formatDate = (date) => {
    const day = ("0" + date.getDate()).slice(-2);
    const month = ("0" + (date.getMonth() + 1)).slice(-2);
    const year = date.getFullYear();

    return `${month}/${day}/${year}`;
  };

  console.log("Form Data", formData);

  const addInventory = async (e) => {
    e.preventDefault();

    const Sku = await getSku();

    const dataToSend = {
      ...formData,
      date_added: formatDate(new Date()),
      sku: Sku,
    };

    const response = await api.post("inventory", dataToSend);

    if (response && response.ok) {
      notificationSvc.success("Data Added");
      navigation("/inventory-items");
    }
  };

  const getInventorybyId = async () => {
    const response = await api.get(`inventory/${id}`);
    if (response && response.ok) {
      setFormData(response.data.data);
      // setSelectStore({
      //   value: response.data.data.store.id,
      //   label: response.data.data.store.name,
      // });
    }
  };

  const getSku = async () => {
    const response = await api.get("get-sku");
    if (response && response.ok) {
      return response.data.data;
    }
  };

  // const updateQuantity = async () => {
  //   const response = await api.post(`update-quantity/${id}`);
  // };

  return (
    <main>
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

        <div className="row">
          <div className="col-md-4 Inventory-category">
            <h4>New</h4>

            <div className="inventory-separate">
              <h5>
                Market Price : {`${convertToUsd(product["new-price"])} $`}
              </h5>
            </div>
            <div className="inventory-separate">
              <h5>
                Suggested Sell Price :{" "}
                {`${convertToUsd(product["retail-new-sell"])} $`}
              </h5>
            </div>

            <div className="inventory-separate">
              <h5>
                Suggested Buy Price :{" "}
                {`${convertToUsd(product["retail-new-buy"])} $`}
              </h5>
            </div>
          </div>

          <div className="col-md-4 Inventory-category">
            <h4>Complete In Box</h4>

            <div className="inventory-separate">
              <h5>
                Market Price : {`${convertToUsd(product["cib-price"])} $`}
              </h5>
            </div>

            <div className="inventory-separate">
              <h5>
                Suggested Sell Price :&nbsp;
                {`${convertToUsd(product["retail-cib-sell"])} $`}
              </h5>
            </div>

            <div className="inventory-separate">
              <h5>
                Suggested Buy Price :{" "}
                {`${convertToUsd(product["retail-cib-buy"])} $`}
              </h5>
            </div>
          </div>

          <div className="col-md-4 Inventory-category">
            <h4>Loose</h4>

            <div className="inventory-separate">
              <h5>
                Market Price : {`${convertToUsd(product["loose-price"])} $`}
              </h5>
            </div>

            <div className="inventory-separate">
              <h5>
                Suggested Sell Price :{" "}
                {`${convertToUsd(product["retail-loose-sell"])} $`}
              </h5>
            </div>

            <div className="inventory-separate">
              <h5>
                Suggested Buy Price :{" "}
                {`${convertToUsd(product["retail-loose-buy"])} $`}
              </h5>
            </div>
          </div>
        </div>

        <form
          className="row mt-3"
          onSubmit={(e) => {
            addInventory(e);
          }}>
          <div className="col-md-3">
            <label className="form-label">Condition</label>
            <Select
              placeholder={"Condition"}
              options={itemOptions}
              onChange={(selectedOption) => {
                setFormData({
                  ...formData,
                  price: {
                    ...formData.price,
                    type: selectedOption.label,
                  },
                });
              }}
            />
          </div>
          <div className="col-md-3">
            <label className="form-label">Quantity</label>
            <input
              type="number"
              placeholder="Quantity to Add"
              value={formData.price.quantity}
              className="form-control"
              onChange={(e) => {
                setFormData({
                  ...formData,
                  price: {
                    ...formData.price,
                    quantity: e.target.value,
                  },
                });
              }}
            />
          </div>
          <div className="col-md-3">
            <label className="form-label">Unit Purchase Price</label>
            <input
              type="text"
              placeholder="Unit Purchase Price"
              className="form-control"
              value={formData.price.unit_purchase_price}
              onChange={(e) => {
                setFormData({
                  ...formData,
                  price: {
                    ...formData.price,
                    unit_purchase_price: parseFloat(e.target.value).toFixed(2),
                  },
                });
              }}
            />
          </div>
          <div className="col-md-3">
            <label className="form-label">Unit Sell Price</label>
            <input
              type="text"
              className="form-control"
              placeholder="Unit Sell Price"
              value={formData.price.unit_sell_price}
              onChange={(e) => {
                setFormData({
                  ...formData,
                  price: {
                    ...formData.price,
                    unit_sell_price: parseFloat(e.target.value).toFixed(2),
                  },
                });
              }}
            />
          </div>
          <div className="col-12 text-end mt-3">
            <button type="submit" className="btn save-btn">
              Save
            </button>
            &nbsp;&nbsp;
            <Link className="btn btn-danger" to={"/inventory-items"}>
              Cancel
            </Link>
          </div>
        </form>
      </div>
    </main>
  );
};

export default InventoryOptions;
