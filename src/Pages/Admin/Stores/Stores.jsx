import React, { useEffect, useState } from "react";
import { Tab, Col, Nav, Row, Modal } from "react-bootstrap";
import { AiFillDelete, AiOutlineEdit } from "react-icons/ai";
import { Link, useNavigate, useParams } from "react-router-dom";
import Table from "../../../Components/Table/Table";
import { api } from "../../../Services/api-service";
import notificationSvc from "../../../Services/notification";
import "./Stores.css";
import Select from "react-select";
import { useLocation } from "react-router-dom";
import { RangeDatePicker } from "react-google-flight-datepicker";
import "react-google-flight-datepicker/dist/main.css";
import AsyncSelect from "react-select/async";
import axios from "axios";
import {
  LEFT_ALIGN,
  LEFT_ALIGN_WITH_BORDER,
  datatableStyle,
  paginationStyle,
} from "../../../Utils/Util";
import TableWare from "../../../Components/DataTable/TableWare.tsx";
import Checkbox from "rc-checkbox";
import "rc-checkbox/assets/index.css";

const Stores = () => {
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const [stores, setStores] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [selectEmployee, setSelectEmployee] = useState([]);
  const [storeOwners, setStoreOwners] = useState([]);
  const [returnPolicy, setReturnPolicy] = useState("");
  const [storeLogo, setStoreLogo] = useState(null);
  const [globalTadePercent, setGlobalTradePercent] = useState(0);
  const [discountPrice, setDiscountPrice] = useState(0);
  const { id } = useParams();
  const navigate = useNavigate();
  const route = useLocation();

  const [loading, setLoading] = useState(false);
  const [json, setJson] = useState([]);
  const [orderBy, setOrderBy] = useState(null);
  const [orderByDir, setOrderByDir] = useState(null);
  const [pageIndex, setPageIndex] = useState(1);
  const [pageSize, setPageSize] = useState(20);
  const [searchString, setSearchString] = useState("");
  const [totalCount, setTotalCount] = useState(0);

  const [updateDiscount, setUpdateDiscount] = useState({
    startDate: "",
    endDate: "",
    discount: 0,
  });

  const [categories, setCategories] = useState([]);

  const [categoryPercent, setCategoryPercent] = useState({
    id: "",
    category: "",
    percentage: "",
  });

  const [checkedEmployees, setCheckedEmployees] = useState([]);

  const [percentCat, setPercentCat] = useState({});

  useEffect(() => {
    if (id) {
      getStores();
      // getStoreEmployee();
      getDiscount();
      getCategory();
      getEmployees();
      globalTradeGet();
      getCategoryGlobalTade();
    }
    getStoreOwner();
  }, []);

  const mediaLabels = [
    {
      Header: "Product Type",
      accessor: "product_type",
    },
    {
      Header: "Print box Labels for",
      accessor: "print_box_labels",
    },
    {
      Header: "Print Media Labels for",
      accessor: "print_media_labels",
    },
    {
      Header: "Actions",
      accessor: "action",
      Cell: () => {
        return (
          <div className="action-icons-edit-del">
            <span>
              <AiOutlineEdit onClick={handleShow} />
            </span>
            &nbsp;&nbsp;&nbsp;
            <span>
              <AiFillDelete />
            </span>
          </div>
        );
      },
    },
  ];

  const labelOptions = [
    {
      Header: "Condition",
      accessor: "condition",
    },
    {
      Header: "Box Labels",
      accessor: "box_labels",
    },
    {
      Header: "Media Labels",
      accessor: "media_labels",
    },
  ];

  const labelData = [
    {
      condition: "New",
    },
    {
      condition: "Complete In Box",
    },
    {
      condition: "Loose",
    },
  ];

  const usersHeader = [
    {
      id: "Id",
      name: "Id",
      selector: (row) => row.id,
      sortable: true,
      style: LEFT_ALIGN_WITH_BORDER,
    },
    {
      id: "Category Name",
      name: "Category Name",
      selector: (row) => row.category,
      sortable: true,
      style: LEFT_ALIGN,
    },
    {
      id: "Percentage",
      name: "Percentage",
      selector: (row) => row.percentage,
      sortable: true,
      style: LEFT_ALIGN,
    },

    {
      cell: (row) => {
        return (
          <>
            <div className="action-icons-edit-del">
              <span>
                <Link
                  onClick={() => {
                    deleteCategoryTrade(row.id);
                  }}>
                  <AiFillDelete />
                </Link>
              </span>
            </div>
          </>
        );
      },
      name: "Action",
      ignoreRowClick: true,
      allowOverflow: true,
      button: true,
    },
  ];

  const getStores = async () => {
    const response = await api.get(`store/${id}`);
    if (response && response.ok) {
      setStores({
        ...response.data.data,
        owner: {
          value: response.data.data.owner.id,
          label: response.data.data.owner.name,
        },
      });
    }
  };

  const getStoreOwner = async () => {
    const response = await api.get("get-users?role=store-owner");

    if (response && response.ok) {
      const result = response.data.data.map((owner) => ({
        label: `${owner.firstName} ${owner.lastName}`,
        value: owner.id,
      }));

      setStoreOwners(result);
    }
  };

  const addStore = async (e) => {
    e.preventDefault();
    if (id) {
      updateStore();
      return;
    }
    const response = await api.post("store", {
      ...stores,
      owner: {
        id: stores.owner.value,
        name: stores.owner.label,
      },
    });
    if (response && response.ok) {
      notificationSvc.success("Store Added Successfully.");
      navigate("/stores");
    }
  };

  const updateStore = async () => {
    const response = await api.put(`store/${id}`, {
      ...stores,
      owner: {
        id: stores.owner.value,
        name: stores.owner.label,
      },
    });
    if (response && response.ok) {
      notificationSvc.success("Store Updated Successfully");
      navigate("/stores");
    }
  };

  const getEmployees = async () => {
    const response = await api.get("employee");
    if (response && response.ok) {
      const result = response.data;
      const employeeNames = result.data.map((emp) => {
        const firstName = emp.firstName;
        const lastName = emp.lastName;
        const empValue = emp.id;
        const employeeName = `${firstName} ${lastName}`;
        return { label: employeeName, value: empValue };
      });
      setEmployees(employeeNames);
    }
  };

  const updateStoreEmployee = async () => {
    const employees = selectEmployee.map((employee) => ({
      name: employee.label,
      id: employee.value,
    }));

    const response = await api.post(`assign-employee/${id}`, employees);
    if (response && response.ok) {
      notificationSvc.success("Employees Updated.");
      getStores();
      setSelectEmployee([]);
    }
  };

  const deleteStoreEmployee = async () => {
    const response = await api.delete(
      `remove-assignment/${id}`,
      {},
      {
        data: checkedEmployees,
      }
    );

    if (response && response.ok) {
      notificationSvc.success("Employees Updated.");
      getStores();
      setCheckedEmployees([]);
    }
  };

  const uploadStoreLogo = async () => {
    const formData = new FormData();
    formData.append("file", storeLogo);
    const response = await api.post("upload", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    if (response && response.ok) {
      return response.data.data;
    }
  };

  const updateReceiptDetails = async (logo) => {
    const response = await api.post(`receipt-details/${id}`, {
      returnPolicy,
      logo,
    });

    if (response && response.ok) {
      notificationSvc.success("Receipt Details Updated.");

      getStores();
    }

    setReturnPolicy("");
    setStoreLogo("");
  };

  const handleReceiptSubmit = async (e) => {
    e.preventDefault();
    const fileUrl = await uploadStoreLogo();
    await updateReceiptDetails(fileUrl);
  };

  const discount = async (e) => {
    e.preventDefault();
    const response = await api.put(`update-discount/${id}`, updateDiscount);

    if (response && response.ok) {
      notificationSvc.success("Discount Updated.");
      getDiscount();
    }
  };

  const getDiscount = async () => {
    const response = await api.get(`get-discount/${id}`);
    if (response && response.ok) {
      setDiscountPrice(response.data.data.discount);
    }
  };

  const globalTade = async (e) => {
    e.preventDefault();
    const response = await api.post(`global-trade-percentage/${id}`, {
      GlobalTradePercentage: globalTadePercent,
    });

    if (response && response.status === 200) {
      notificationSvc.success("Global Trade Percentage Updated.");
    }
  };

  const globalTradeGet = async () => {
    const response = await api.get(`global-trade-percentage/${id}`);
    if (response && response.status === 200) {
      setGlobalTradePercent(response.data.data);
    }
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

  const getCategory = async () => {
    const response = await api.get("category");
    if (response && response.status === 200) {
      const options = response.data.data.map((category) => ({
        value: category.id,
        label: category.name,
      }));

      setCategories(options);
    }
  };

  const categoryGlobalTade = async (e) => {
    e.preventDefault();
    const response = await api.post(
      `category-percentage/${id}`,
      categoryPercent
    );

    if (response && response.status === 200) {
      notificationSvc.success("Categorys Trade Percentage Updated.");
      getCategoryGlobalTade();
    }
  };

  const getCategoryGlobalTade = async () => {
    const response = await api.get(`category-percentage/${id}`);

    if (response && response.status === 200) {
      setPercentCat(response.data.data);
    }
  };

  const deleteCategoryTrade = async (catId) => {
    const response = await api.delete(
      `category-percentage/${id}`,
      {},
      {
        data: { id: catId },
      }
    );

    if (response && response.status === 200) {
      notificationSvc.success("Deleted Successfully");
      getCategoryGlobalTade();
    }
  };

  return (
    <main>
      <div className="container-fluid">
        <div className="edit-customer-main">
          <Tab.Container id="left-tabs-example" defaultActiveKey="Storedetails">
            <Row>
              <Col sm={2} className="dash-details-sidebar">
                <Nav variant="pills" className="flex-column">
                  <Nav.Item>
                    <Nav.Link eventKey="Storedetails">Store Details</Nav.Link>
                  </Nav.Item>

                  {route.pathname !== "/add-stores" && (
                    <>
                      <Nav.Item>
                        <Nav.Link eventKey="employees">Employees</Nav.Link>
                      </Nav.Item>

                      <Nav.Item>
                        <Nav.Link eventKey="receiptDetails">
                          Receipt Details
                        </Nav.Link>
                      </Nav.Item>

                      <Nav.Item>
                        <Nav.Link eventKey="boxMedia">
                          Box and Media Labels
                        </Nav.Link>
                      </Nav.Item>
                      <Nav.Item>
                        <Nav.Link eventKey="store_settings">
                          Store Settings
                        </Nav.Link>
                      </Nav.Item>
                    </>
                  )}
                </Nav>
              </Col>
              <Col sm={10}>
                <Tab.Content>
                  <Tab.Pane eventKey="Storedetails">
                    <form className="row g-3" onSubmit={(e) => addStore(e)}>
                      {/* <h5 className="edit-customer-form-strips">
                        Store Details
                      </h5> */}

                      <div className="row page-header mt-3">
                        <div className="col-6 p-0">
                          <h2 className="heading-main-page ">Store Details</h2>
                        </div>
                      </div>
                      <div className="col-md-6">
                        <label className="form-label">Store Owner</label>
                        <Select
                          options={storeOwners}
                          placeholder="Select Owners"
                          value={stores.owner}
                          onChange={(e) => {
                            setStores({
                              ...stores,
                              owner: { value: e.value, label: e.label },
                            });
                          }}
                        />
                      </div>
                      <div className="col-md-6">
                        <label className="form-label">Store Name</label>
                        <input
                          type="text"
                          className="form-control"
                          value={stores.storeName}
                          onChange={(e) => {
                            setStores({ ...stores, storeName: e.target.value });
                          }}
                        />
                      </div>
                      <div className="col-md-6">
                        <label className="form-label">Street Line 1</label>
                        <input
                          type="text"
                          className="form-control"
                          value={stores.line1}
                          onChange={(e) =>
                            setStores({
                              ...stores,
                              line1: e.target.value,
                            })
                          }
                        />
                      </div>

                      <div className="col-6">
                        <label className="form-label">Street Line 2</label>
                        <input
                          type="text"
                          className="form-control"
                          value={stores.line2}
                          onChange={(e) =>
                            setStores({
                              ...stores,
                              line2: e.target.value,
                            })
                          }
                        />
                      </div>

                      <div className="col-md-6">
                        <label className="form-label">State</label>
                        <input
                          type="text"
                          className="form-control"
                          value={stores.state}
                          onChange={(e) =>
                            setStores({
                              ...stores,
                              state: e.target.value,
                            })
                          }
                        />
                      </div>
                      <div className="col-md-6">
                        <label className="form-label">City</label>
                        <input
                          type="text"
                          className="form-control"
                          value={stores.city}
                          onChange={(e) =>
                            setStores({
                              ...stores,
                              city: e.target.value,
                            })
                          }
                        />
                      </div>
                      <div className="col-md-6">
                        <label className="form-label">Zip</label>
                        <input
                          type="text"
                          className="form-control"
                          value={stores.zip}
                          onChange={(e) =>
                            setStores({
                              ...stores,
                              zip: e.target.value,
                            })
                          }
                        />
                      </div>
                      <div className="col-md-6">
                        <label className="form-label">Phone Number</label>
                        <input
                          type="text"
                          className="form-control"
                          value={stores.phoneNumber}
                          onChange={(e) =>
                            setStores({
                              ...stores,
                              phoneNumber: e.target.value,
                            })
                          }
                        />
                      </div>
                      <div className="col-md-6">
                        <label className="form-label">Default Tax (%)</label>
                        <input
                          type="text"
                          className="form-control"
                          value={stores.defaultTax}
                          onChange={(e) =>
                            setStores({
                              ...stores,
                              defaultTax: e.target.value,
                            })
                          }
                        />
                      </div>

                      <div className="col-12 text-end">
                        <button type="submit" className="btn save-btn">
                          Save
                        </button>
                        &nbsp;&nbsp;
                        <Link className="btn btn-danger" to={"/stores"}>
                          Cancel
                        </Link>
                      </div>
                    </form>
                  </Tab.Pane>
                  {route.pathname !== "/add-stores" && (
                    <>
                      <Tab.Pane eventKey="employees">
                        <div className="row page-header mt-3">
                          <div className="col-6">
                            <h2 className="heading-main-page">
                              Store Employees
                            </h2>
                          </div>
                        </div>

                        <div className="row mt-4">
                          <div className="col-md-9 employee-list-main-store">
                            <Select
                              isMulti
                              options={employees}
                              onChange={(e) => {
                                setSelectEmployee(e);
                              }}
                            />
                          </div>
                          <div className="col-md-3 employees-update">
                            {checkedEmployees.length !== 0 ? (
                              <button
                                className="btn w-100"
                                onClick={deleteStoreEmployee}>
                                Delete Selected Employees
                              </button>
                            ) : (
                              <button
                                className="btn w-100"
                                onClick={updateStoreEmployee}>
                                Update
                              </button>
                            )}
                          </div>
                        </div>

                        <div className="store-employees">
                          <div>
                            {stores &&
                              stores.employees &&
                              stores.employees.map((emp) => (
                                <div
                                  key={emp.id}
                                  className="employee-item mt-3">
                                  <label>
                                    <Checkbox
                                      onChange={(e) => {
                                        if (e.target.checked) {
                                          setCheckedEmployees((prev) => [
                                            ...prev,
                                            { id: emp.id, name: emp.name },
                                          ]);
                                        } else {
                                          setCheckedEmployees((prev) =>
                                            prev.filter(
                                              (employeeId) =>
                                                employeeId.id !== emp.id
                                            )
                                          );
                                        }
                                      }}
                                    />
                                    &nbsp;&nbsp;&nbsp;
                                    {emp.name}
                                  </label>
                                </div>
                              ))}
                          </div>
                        </div>
                      </Tab.Pane>

                      <Tab.Pane eventKey="receiptDetails">
                        <h5 className="edit-customer-form-strips">
                          Receipt Details
                        </h5>

                        <div className="row receipt-section">
                          <div className="col-md-6 return-policy">
                            <label className="form-label">Return Policy</label>
                            <textarea
                              className="w-100"
                              rows="5"
                              value={returnPolicy}
                              onChange={(e) => {
                                setReturnPolicy(e.target.value);
                              }}></textarea>
                          </div>

                          <div className="col-md-6 return-policy">
                            <label className="form-label">Logo</label>
                            <input
                              type="file"
                              name=""
                              id=""
                              className="form-control"
                              onChange={(e) => {
                                setStoreLogo(e.target.files[0]);
                              }}
                            />
                            <div className="employees-update mt-4">
                              <button
                                className="w-100"
                                onClick={(e) => {
                                  handleReceiptSubmit(e);
                                }}>
                                Update
                              </button>
                            </div>
                          </div>
                        </div>

                        <div className="image-policy">
                          <div className="policy">
                            <p>{stores.returnPolicy}</p>
                          </div>
                          <div className="store-logo mt-4">
                            <img src={stores.logo} alt="" />
                          </div>
                        </div>
                      </Tab.Pane>

                      <Tab.Pane eventKey="boxMedia">
                        <h5 className="edit-customer-form-strips">
                          Box And Media Labels
                        </h5>
                        <div className="table-responsive">
                          <Table
                            headers={mediaLabels}
                            gridData={[{}, {}]}
                            pageSize={20}
                            btnText={"+ Create New Label Options"}
                            btnUrl={""}
                          />
                        </div>
                      </Tab.Pane>

                      <Tab.Pane eventKey="store_settings">
                        <div>
                          <h2 className="heading-main-page">Settings</h2>
                          {/* <div className="row"> */}
                          <form
                            className="row g-3 mt-3"
                            onSubmit={(e) => {
                              discount(e);
                            }}>
                            <div className="col-md-4">
                              <label className="form-label">
                                Set Discount Duration
                              </label>
                              <RangeDatePicker
                                startDate={updateDiscount.startDate}
                                endDate={updateDiscount.endDate}
                                onChange={(startDate, endDate) =>
                                // onDateChange(startDate, endDate)
                                {
                                  setUpdateDiscount((prev) => ({
                                    ...prev,
                                    startDate: startDate,
                                    endDate: endDate,
                                  }));
                                }
                                }
                                minDate={new Date(1900, 0, 1)}
                                maxDate={new Date(2100, 0, 1)}
                                dateFormat="DD/MM/YYYY"
                                startDatePlaceholder="Start Date"
                                endDatePlaceholder="End Date"
                                disabled={false}
                                className=""
                                startWeekDay="monday"
                              />
                            </div>

                            {/* <p>Duration: </p> */}

                            <div className="col-md-5">
                              <div className="row">
                                <div className="col-md-6">
                                  <label className="form-label">
                                    Enter Discount Value
                                  </label>
                                  <input
                                    type="text"
                                    className="form-control"
                                    onChange={(e) => {
                                      setUpdateDiscount((prev) => ({
                                        ...prev,
                                        discount: parseInt(e.target.value),
                                      }));
                                    }}
                                  />
                                </div>
                                <div className="col-md-6">
                                  <label className="form-label">
                                    Discount Value
                                  </label>
                                  <input
                                    type="text"
                                    value={discountPrice?.discount}
                                    className="form-control"
                                    disabled
                                  />
                                </div>
                              </div>
                            </div>

                            <div className="col-md-3">
                              <button className="btn update-discount-btn w-100">
                                Update Discount
                              </button>
                            </div>
                          </form>

                          <form className="row g-3 mt-5">
                            <div className="col-md-4">
                              <label className="form-label">
                                Global Trade Percentage
                              </label>
                              <input
                                type="text"
                                className="form-control"
                                onChange={(e) => {
                                  setGlobalTradePercent(
                                    parseInt(e.target.value)
                                  );
                                }}
                              />
                            </div>
                            <div className="col-md-4">
                              <label className="form-label">
                                Global Trade Percentage Value
                              </label>
                              <input
                                type="text"
                                value={globalTadePercent}
                                className="form-control"
                                disabled
                              />
                            </div>
                            <div className="col-md-4">
                              <button
                                className="btn update-discount-btn w-100"
                                onClick={(e) => {
                                  globalTade(e);
                                }}>
                                Update Percentage
                              </button>
                            </div>
                          </form>

                          <form className="row g-3 mt-5">
                            <div className="col-md-4">
                              <label className="form-label">
                                Select Category
                              </label>
                              <Select
                                options={categories}
                                placeholder="Search inventory..."
                                onChange={(selectedOption) => {
                                  setCategoryPercent((prev) => ({
                                    ...prev,
                                    category: selectedOption.label,
                                    id: selectedOption.value,
                                  }));
                                }}
                                styles={styles}
                              />
                            </div>
                            <div className="col-md-4">
                              <label className="form-label">
                                Trade Percentage for Category
                              </label>
                              <input
                                type="text"
                                className="form-control"
                                onChange={(e) => {
                                  setCategoryPercent((prev) => ({
                                    ...prev,
                                    percentage: e.target.value,
                                  }));
                                }}
                              />
                            </div>
                            <div className="col-md-4">
                              <button
                                className="btn update-discount-btn w-100"
                                onClick={(e) => {
                                  categoryGlobalTade(e);
                                }}>
                                Update Category Percentage
                              </button>
                            </div>
                            {/* <p>Trade Percent: </p> */}
                          </form>

                          <div className="category-percent-table mt-3">
                            <div className="responsive-table">
                              <TableWare
                                json={percentCat}
                                tableColumns={usersHeader}
                                customStyles={datatableStyle}
                                paginationStyles={paginationStyle}
                                enableSearch={false}
                                loading={loading}
                                enablePagination={totalCount > pageSize}
                                pageIndex={pageIndex}
                                pageSize={pageSize}
                                totalCount={totalCount}
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
                      </Tab.Pane>
                    </>
                  )}
                </Tab.Content>
              </Col>
            </Row>
          </Tab.Container>
        </div>
      </div>

      <Modal show={show} onHide={handleClose} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>Edit Label Options</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Table headers={labelOptions} gridData={labelData} pageSize={3} />
        </Modal.Body>
      </Modal>
    </main>
  );
};

export default Stores;
