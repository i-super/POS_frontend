import React, { useEffect, useState } from "react";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import Select from "react-select";
import { api } from "../../../Services/api-service";
import notificationSvc from "../../../Services/notification";

const EditInventory = () => {
  const [product, setProduct] = useState({});
  const [getAStore, setGetAStore] = useState([]);
  const [selectStore, setSelectStore] = useState(null);
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
    // setFormData({
    //   ...formData,
    //   product_id: product["id"],
    //   product_name: product["product-name"],
    //   category_name: product["console-name"],
    //   store: selectStore
    //     ? {
    //         id: selectStore.value,
    //         name: selectStore.label,
    //       }
    //     : {},
    // });
  }, []);

  useEffect(() => {
    if (id && route.pathname == `/edit-inventory/${id}`) {
      getInventorybyId();
    }
    // productInfo();
  }, []);

  //   const productInfo = async () => {
  //     const response = await axios.get(
  //       `https://www.pricecharting.com/api/product?t=be026bb3efdf1c0891fc044277d53e2f46a5ab45&id=${id}`
  //     );

  //     if (response.status === 200) {
  //       setProduct({ ...response.data });
  //       console.log("Product Info", response.data);
  //     }
  //   };

  const getStores = async () => {
    const response = await api.get("get-store");
    if (response && response.ok) {
      const options = response.data.data.map((store) => {
        return { value: store.id, label: store.storeName };
      });

      setGetAStore(options);
      console.log("Stores", response.data);
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

  //   const addInventory = async (e) => {
  //     e.preventDefault();

  //     const Sku = await getSku();

  //     const dataToSend = {
  //       ...formData,
  //       date_added: formatDate(new Date()),
  //       sku: Sku,
  //     };

  //     const response = await api.post("inventory", dataToSend);

  //     if (response && response.ok) {
  //       notificationSvc.success("Data Added");
  //       navigation("/inventory-items");
  //     }
  //   };

  const getInventorybyId = async () => {
    const response = await api.get(`inventory/${id}`);
    if (response && response.ok) {
      setFormData(response.data.data);
      setSelectStore({
        value: response.data.data.store.id,
        label: response.data.data.store.name,
      });
    }
  };

  const addInventory = async (e) => {
    e.preventDefault();

    const dataToSend = {
      ...formData,
    };

    const response = await api.post("inventory", dataToSend);

    if (response && response.ok) {
      notificationSvc.success("Inventory updated successfully");
      navigation("/inventory-items");
    }
  };

  //   const getSku = async () => {
  //     const response = await api.get("get-sku");
  //     if (response && response.ok) {
  //       return response.data.data;
  //     }
  //   };

  // const updateQuantity = async () => {
  //   const response = await api.post(`update-quantity/${id}`);
  // };

  return (
    <main>
      <div className="container-fluid">
        <div className="row mt-3">
          <div className="col-md-3">
            <h3 className="option-invent">Product ID</h3>
            <h4 className="option-result">{formData.product_id}</h4>
          </div>

          <div className="col-md-3">
            <h3 className="option-invent">Console</h3>
            <h4 className="option-result">{formData.category_name}</h4>
          </div>

          <div className="col-md-3">
            <h3 className="option-invent">Product</h3>
            <h4 className="option-result">{formData.product_name}</h4>
          </div>

          <div className="col-md-3">
            <h3 className="option-invent">Date Added</h3>
            <h4 className="option-result">{formData.date_added}</h4>
          </div>
        </div>
        <hr />

        <div className="row mt-3">
          <div className="col-md-6 option-list">
            <h5 className="option-name">Store</h5>
            <Select
              options={getAStore}
              className="w-50"
              value={selectStore}
              onChange={(e) => {
                setSelectStore(e);
              }}
            />
          </div>
          <div className="col-md-6 option-list text-end">
            <h5 className="option-name">Stock Number (SKU)</h5>
            <p className="option-value">
              {formData.sku ? formData.sku : "Auto-Generated"}
            </p>
          </div>
        </div>

        <form
          className="row mt-3"
          onSubmit={(e) => {
            addInventory(e);
          }}
        >
          <div className="col-md-3">
            <Select
              placeholder={"Condition"}
              options={itemOptions}
              isDisabled
              value={{ label: formData.price.type, value: formData.price.type }}
            />
          </div>
          <div className="col-md-3">
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

export default EditInventory;
