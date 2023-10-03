import React, { useEffect, useState } from "react";
import { Modal } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import AsyncSelect from "react-select/async";
import { api } from "../../Services/api-service";
import { AiFillDelete, AiOutlineEdit } from "react-icons/ai";
import notificationSvc from "../../Services/notification";
import "./PriceChanges.css";
import {
  LEFT_ALIGN,
  LEFT_ALIGN_WITH_BORDER,
  datatableStyle,
  paginationStyle,
} from "../../Utils/Util";
import TableWare from "../../Components/DataTable/TableWare.tsx";

const PriceChanges = () => {
  const [key, setKey] = useState();
  const [lgShow, setLgShow] = useState(false);
  const [inventoryList, setInventoryList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [json, setJson] = useState([]);
  const [orderBy, setOrderBy] = useState(null);
  const [orderByDir, setOrderByDir] = useState(null);
  const [pageIndex, setPageIndex] = useState(1);
  const [pageSize, setPageSize] = useState(20);
  const [searchString, setSearchString] = useState("");
  const [totalCount, setTotalCount] = useState(0);
  const navigate = useNavigate();

  const InventoryColumns = [
    {
      id: "sku",
      name: "Sku",
      selector: (row) => row.sku,
      sortable: true,
      width: "8%",
      style: LEFT_ALIGN_WITH_BORDER,
    },

    {
      id: "Category Name",
      name: "Category Name",
      selector: (row) => row.category_name,
      sortable: true,
      width: "15%",
      style: LEFT_ALIGN,
    },
    {
      id: "Product Name",
      name: "Product Name",
      selector: (row) => row.product_name,
      sortable: true,
      style: LEFT_ALIGN,
    },

    {
      id: "Unit Purchase Price",
      name: "Unit Purchase Price",
      selector: (row) => `$ ${row.price.unit_purchase_price}`,
      sortable: true,
      style: LEFT_ALIGN,
    },
    {
      id: "Unit Sell Price",
      name: "Unit Sell Price",
      selector: (row) => `$ ${row.price.unit_sell_price}`,
      sortable: true,
      style: LEFT_ALIGN,
    },
    {
      id: "Quantity",
      name: "Quantity",
      selector: (row) => row.price.quantity,
      sortable: true,
      style: LEFT_ALIGN,
    },
    {
      id: "Condition",
      name: "Condition",
      selector: (row) => row.price.type,
      sortable: true,
      style: LEFT_ALIGN,
    },
    {
      id: "Percentage Difference",
      name: "Percentage Difference",
      selector: (row) => row.Percentage_diff,
      sortable: true,
      style: LEFT_ALIGN,
    },
    {
      id: "Dollar Difference",
      name: "Dollar Difference",
      selector: (row) => row.dollar_diff,
      sortable: true,
      style: LEFT_ALIGN,
    },
  ];

  useEffect(() => {
    getInventory();
  }, []);

  const getInventList = async (query) => {
    const response = await axios.get(
      `https://www.pricecharting.com/api/products?t=be026bb3efdf1c0891fc044277d53e2f46a5ab45&q=${query}`
    );
    if (response.status === 200) {
      const products = response.data.products.map((product) => ({
        id: product.id,
        consoleName: product["console-name"],
        productName: product["product-name"],
      }));
      return products;
    }
  };

  const loadOptions = (inputValue, callback) => {
    getInventList(inputValue).then((options) => {
      const selectOptions = options.map((option) => ({
        value: option.id,
        label: `${option.consoleName} - - ${option.productName}`,
      }));
      callback(selectOptions);
    });
  };

  const getData = (id) => {
    navigate(`/inventory-options/${id}`);
  };

  const styles = {
    control: (provided, state) => ({
      ...provided,
      borderRadius: 0,
      borderColor: state.isFocused ? "#283f68;;" : "gray",
      boxShadow: state.isFocused ? "0 0 0 1px blue" : "none",
    }),
    option: (provided, state) => ({
      ...provided,
      backgroundColor: state.isFocused ? "#283f68;;" : "white",
      color: state.isFocused ? "white" : "black",
    }),
    singleValue: (provided, state) => ({
      ...provided,
      color: state.isFocused ? "white" : "black",
    }),
    input: (provided, state) => ({
      ...provided,
      color: state.isFocused ? "white" : "black",
    }),
    placeholder: (provided, state) => ({
      ...provided,
      color: state.isFocused ? "white" : "gray",
    }),
    indicatorSeparator: (provided, state) => ({
      ...provided,
      backgroundColor: state.isFocused ? "white" : "gray",
    }),
    dropdownIndicator: (provided, state) => ({
      ...provided,
      color: state.isFocused ? "white" : "gray",
    }),
    menu: (provided, state) => ({
      ...provided,
      backgroundColor: state.isFocused ? "blue" : "white",
    }),
    menuList: (provided, state) => ({
      ...provided,
      padding: 0,
      margin: 0,
    }),
    groupHeading: (provided, state) => ({
      ...provided,
      color: state.isFocused ? "white" : "black",
    }),
    optionGroup: (provided, state) => ({
      ...provided,
      backgroundColor: state.isFocused ? "blue" : "white",
      color: state.isFocused ? "white" : "black",
    }),
    group: (provided, state) => ({
      ...provided,
      borderColor: state.isFocused ? "white" : "gray",
    }),
    label: (provided, state) => ({
      ...provided,
      color: state.isFocused ? "white" : "black",
    }),
  };

  const getInventory = async () => {
    const response = await api.get("inventory");
    if (response && response.ok) {
      console.log(response.data);
      setInventoryList(response.data.data);
    }
  };

  const searchItem = (val) => {
    setPageIndex(1);
    setSearchString(val);
  };

  return (
    <main>
      <div className="container-fluid">
        <div className="row page-header mt-3">
          <div className="col-6">
            <h2 className="heading-main-page">Price Changes</h2>
          </div>
          <div className="col-6 book-details-btn">
            <input
              type="text"
              className="form-control w-50 max-300 float-end"
              placeholder="search here"
              value={searchString}
              onChange={(e) => {
                searchItem(e.target.value);
              }}
            />
          </div>
        </div>
        <div className="inventory-item-table mt-3">
          <div className="table-responsive">
            <TableWare
              json={inventoryList}
              tableColumns={InventoryColumns}
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
        </div>
      </div>

      <Modal
        size="lg"
        show={lgShow}
        onHide={() => setLgShow(false)}
        aria-labelledby="example-modal-sizes-title-lg">
        <Modal.Header closeButton>
          <Modal.Title id="example-modal-sizes-title-lg">
            Inventory List
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <AsyncSelect
            cacheOptions
            loadOptions={loadOptions}
            placeholder="Search inventory..."
            onChange={(selectedOption) => {
              getData(selectedOption.value);
            }}
            styles={styles}
          />
        </Modal.Body>
      </Modal>
    </main>
  );
};

export default PriceChanges;
