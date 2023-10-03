import React, { useContext, useEffect, useState } from "react";
import { Modal } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import * as XLSX from 'xlsx';
import AsyncSelect from "react-select/async";
import { api } from "../../../Services/api-service";
import { AiFillDelete, AiOutlineEdit } from "react-icons/ai";
import notificationSvc from "../../../Services/notification";
import "./Items.css";
import {
  LEFT_ALIGN,
  LEFT_ALIGN_WITH_BORDER,
  datatableStyle,
  paginationStyle,
} from "../../../Utils/Util";
import Table from "../../../Components/Table/Table";
import { StoreContext } from "../../../Components/StoreContext";

const Items = () => {
  const { selectedStore } = useContext(StoreContext)
  const [key, setKey] = useState();
  const [lgShow, setLgShow] = useState(false);
  const [inventoryList, setInventoryList] = useState([]);

  const [loading, setLoading] = useState(false);
  const [json, setJson] = useState([]);
  const [orderBy, setOrderBy] = useState(null);
  const [orderByDir, setOrderByDir] = useState(null);
  const [pageIndex, setPageIndex] = useState(1);
  const [pageSize, setPageSize] = useState(50);

  const [searchString, setSearchString] = useState("");

  const [totalCount, setTotalCount] = useState(0);

  const navigate = useNavigate();

  const InventoryColumns = [
    {
      Header: "sku",
      accessor: "sku",
      selector: (row) => row.sku,
      sortable: true,
      width: "8%",
      style: LEFT_ALIGN_WITH_BORDER,
    },
    {
      Header: "Date Added",
      accessor: "date_added",
      selector: (row) => row.date_added,
      sortable: true,
      width: "11%",
      style: LEFT_ALIGN,
    },
    {
      Header: "Category Name",
      accessor: "category_name",
      selector: (row) => row.category_name,
      sortable: true,
      width: "15%",
      style: LEFT_ALIGN,
    },
    {
      Header: "Product Name",
      accessor: "product_name",
      selector: (row) => row.product_name,
      sortable: true,
      style: LEFT_ALIGN,
    },

    {
      Header: "Unit Purchase Price",
      accessor: "price.unit_purchase_price",
      selector: (row) => `$ ${row.price.unit_purchase_price}`,
      sortable: true,
      style: LEFT_ALIGN,
    },
    {
      Header: "Unit Sell Price",
      accessor: "price.unit_sell_price",
      selector: (row) => `$ ${row.price.unit_sell_price}`,
      sortable: true,
      style: LEFT_ALIGN,
    },
    {
      Header: "Quantity",
      accessor: "price.quantity",
      selector: (row) => row.price.quantity,
      sortable: true,
      style: LEFT_ALIGN,
    },
    {
      Header: "Condition",
      accessor: "price.type",
      selector: (row) => row.price.type,
      sortable: true,
      style: LEFT_ALIGN,
    },
    {
      Header: " ",
      accessor: "riw",
      Cell: ({ row }) => {
        return (
          <>
            <div className="action-icons-edit-del">
              <span>
                <AiOutlineEdit onClick={() => navigate(`/edit-inventory/${row.original.id}`)} />
              </span>
              &nbsp;&nbsp;&nbsp;
              <span>
                <AiFillDelete onClick={() => deleteInventItem(row.original.id)} />
              </span>
            </div>
          </>
        );
      },
      name: "Action",
      // width: "8%",
      ignoreRowClick: true,
      allowOverflow: true,
      button: true,
    },
  ];

  useEffect(() => {
    if (selectedStore.value) {
      getInventory();
    }
  }, [selectedStore]);

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
    const response = await api.get(`inventory?store=${selectedStore.value}`);
    if (response && response.ok) {
      console.log(response.data);
      setInventoryList(response.data.data);
    }
  };

  const deleteInventItem = async (id) => {
    const response = await api.delete(`inventory/${id}`, { store: selectedStore.value, id: id });
    if (response && response.ok) {
      notificationSvc.success("Item Deleted Successfully.");

      getInventory();
    }
  };

  const formatDate = (date) => {
    const day = ("0" + date.getDate()).slice(-2);
    const month = ("0" + (date.getMonth() + 1)).slice(-2);
    const year = date.getFullYear();

    return `${month}/${day}/${year}`;
  };

  const handleFileUpload = async (e) => {
    let errors = [];
    let inventory = [];
    let required = ["Stock #", "Condition", "Product Name", "Category", "COGS", "Price", "Store", "Quantity"]

    const file = e.target.files[0];
    const reader = new FileReader();
    reader.onload = async (evt) => {
      const bstr = evt.target.result;
      const wb = XLSX.read(bstr, { type: "binary" });
      const wsname = wb.SheetNames[0];
      const ws = wb.Sheets[wsname];
      const data = XLSX.utils.sheet_to_csv(ws, { header: 1 });
      const dataStringLines = data.split(/\r\n|\n/);
      const headers = dataStringLines[0].split(",");
      required.forEach((key) => {
        if (!headers.includes(key)) {
          errors.push(`${key} is not found in file`);
        }
      })
      if (errors.length > 0) {
        notificationSvc.error(errors[0])
        e.target.value = null;
        return;
      }
      for (let i = 1; i < dataStringLines.length; i++) {
        let item = dataStringLines[i].split(",");
        inventory.push({
          product_id: Math.floor(Math.random() * 100000).toString(),
          product_name: item[headers.indexOf("Product Name")],
          category_name: item[headers.indexOf("Category")],
          sku: item[headers.indexOf("Stock #")],
          store: {
            id: selectedStore.value,
            name: selectedStore.label,
          },
          date_added: formatDate(new Date()),
          price: {
            unit_purchase_price: Number(item[headers.indexOf("COGS")]) || 0,
            unit_sell_price: Number(item[headers.indexOf("Price")]) || 0,
            quantity: Number(item[headers.indexOf("Quantity")]),
            type: item[headers.indexOf("Condition")] === "completeInBox" ? "Complete In Box" : item[headers.indexOf("Condition")] === "loose" ? "Loose" : "New",
          },
        })
      }
      const response = await api.post('bulk-upload', inventory);
      if (response.ok) {
        notificationSvc.success("Data bulk uploaded successfully")
        getInventory()
      }
      e.target.value = null;
    };
    reader?.readAsBinaryString(file);
  }

  return (
    <main>
      <div className="container-fluid">
        <div className="row page-header mt-3">
          <div className="col-6">
            <h2 className="heading-main-page">Inventory Details</h2>
          </div>
          <div className="col-6 book-details-btn text-end">
            <div className="fileBtn upload-btn me-2">
              <input
                type="file"
                onChange={(e) => handleFileUpload(e)}
                className="fileUpload"
                id="file"
              />
              <label htmlFor="file" className="btn btn-indigo px-3">
                <button
                  className="btn">Import from file</button>
              </label>
            </div>
            <button
              className="btn"
              onClick={() => {
                setLgShow(true);
              }}>
              Add Inventory
            </button>
          </div>
        </div>
        <div className="inventory-item-table mt-3">
          <div className="table-responsive">
            <Table
              gridData={inventoryList}
              headers={InventoryColumns}
              customStyles={datatableStyle}
              paginationStyles={paginationStyle}
              search={true}
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

export default Items;
