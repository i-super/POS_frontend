import React, { useContext, useEffect, useState } from "react";
import "./AddCustomer.css";
import Col from "react-bootstrap/Col";
import Nav from "react-bootstrap/Nav";
import Row from "react-bootstrap/Row";
import Tab from "react-bootstrap/Tab";
import Modal from "react-bootstrap/Modal";
import Table from "../../../Components/Table/Table";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import { api } from "../../../Services/api-service";
import notificationSvc from "../../../Services/notification";
import axios from "axios";
import AsyncSelect from "react-select/async";
import Select from "react-select";
import { FaAsterisk } from "react-icons/fa";
import {
  LEFT_ALIGN,
  LEFT_ALIGN_WITH_BORDER,
  datatableStyle,
  paginationStyle,
} from "../../../Utils/Util";
import TableWare from "../../../Components/DataTable/TableWare.tsx";
import { AiFillDelete } from "react-icons/ai";
import { StoreContext } from "../../../Components/StoreContext";

const EditCustomer = () => {
  const [showNotification, setShowNotification] = useState(false);

  const [customer, setCustomer] = useState({});

  const [selectedItems, setSelectedItems] = useState({
    id: "",
    category: "",
    product: "",
  });

  const [userStores, setUserStores] = useState([]);

  const [notifications, setNotifications] = useState([]);

  const [loading, setLoading] = useState(false);
  const [json, setJson] = useState([]);
  const [orderBy, setOrderBy] = useState(null);
  const [orderByDir, setOrderByDir] = useState(null);
  const [pageIndex, setPageIndex] = useState(1);
  const [pageSize, setPageSize] = useState(20);
  const [searchString, setSearchString] = useState("");
  const [totalCount, setTotalCount] = useState(0);

  const navigate = useNavigate();

  const { id } = useParams();

  const route = useLocation();

  useEffect(() => {
    if (id) {
      getCustomer();
      getNotifications();
    }
    getStores();
  }, []);

  const handleCloseNotification = () => setShowNotification(false);
  const handleShowNotification = () => setShowNotification(true);

  const headers = [
    {
      id: "Id",
      name: "Id",
      selector: (row) => row.id,
      sortable: true,
      style: LEFT_ALIGN_WITH_BORDER,
    },
    {
      id: "Category",
      name: "Category",
      selector: (row) => row.category,
      sortable: true,
      style: LEFT_ALIGN,
    },
    {
      id: "Product",
      name: "Product",
      selector: (row) => row.product,
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
                    deleteNotification(row.id);
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

  const getCustomer = async () => {
    const response = await api.get(`customer/${id}`);
    if (response && response.ok) {
      console.log(response.data.data);
      setCustomer({
        ...response.data.data,
        store: {
          id: response.data.data.store.id,
          name: response.data.data.store.name,
        },
      });
    }
  };

  const addCustomer = async (e) => {
    e.preventDefault();
    if (id) {
      updateCustomer();
      return;
    }
    const response = await api.post("customer", {
      ...customer,
    });
    if (response && response.ok) {
      notificationSvc.success("Customer Added Successfully");
      navigate("/customer");
    }
  };

  const updateCustomer = async () => {
    const response = await api.put(`customer/${id}`, {
      ...customer,
    });
    if (response && response.ok) {
      notificationSvc.success("Customer Updated Successfully.");
      navigate("/customer");
    }
  };

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
      console.log(options);
      const selectOptions = options.map((option) => ({
        value: option.id,
        label: `${option.consoleName}/${option.productName}`,
        category: option.consoleName,
        product: option.productName,
      }));
      callback(selectOptions);
    });
  };

  const handleSelect = (option) => {
    console.log(option);
    setSelectedItems(() => ({
      id: option.value,
      category: option.category,
      product: option.product,
    }));
  };

  const updateNotification = async () => {
    const response = await api.post(`notification/${id}`, selectedItems);
    if (response && response.ok) {
      notificationSvc.success("Notification Added Successfully");
      handleCloseNotification();
      getNotifications();
    }
  };

  const getStores = async () => {
    const response = await api.get("get-store");
    if (response && response.ok) {
      console.log("User Data", response.data);
      const options = response.data.data.map((store) => {
        return {
          value: store.id,
          label: store.storeName,
        };
      });
      setUserStores(options);
    }
  };

  const getNotifications = async () => {
    const response = await api.get(`notification/${id}`);
    if (response && response.status === 200) {
      setNotifications(response.data.data);
      console.log(response.data);
    }
  };

  const deleteNotification = async (notifyId) => {
    const response = await api.delete(
      `notification/${id}`,
      {},
      {
        data: {
          id: notifyId,
        },
      }
    );
    if (response && response.status === 200) {
      notificationSvc.success("Notification Deleted");
      getNotifications();
    }
  };

  const { selectedStore } = useContext(StoreContext);

  useEffect(() => {
    if (selectedStore) {
      setCustomer((prevCustomer) => ({
        ...prevCustomer,
        store: {
          id: selectedStore.value,
          name: selectedStore.label,
        },
      }));
    }
  }, [selectedStore]);

  return (
    <main>
      <div className="container-fluid">
        <div className="edit-customer-main">
          <Tab.Container id="left-tabs-example" defaultActiveKey="details">
            <Row>
              <Col sm={2} className="dash-details-sidebar">
                <Nav variant="pills" className="flex-column">
                  <Nav.Item>
                    <Nav.Link eventKey="details">Details</Nav.Link>
                  </Nav.Item>

                  {route.pathname !== "/add-customer" && (
                    <>
                      <Nav.Item>
                        <Nav.Link eventKey="notifications">
                          Notifications
                        </Nav.Link>
                      </Nav.Item>
                      {/* <Nav.Item>
                        <Nav.Link eventKey="sales">Sales</Nav.Link>
                      </Nav.Item>
                      <Nav.Item>
                        <Nav.Link eventKey="trades">Trades</Nav.Link>
                      </Nav.Item> */}
                    </>
                  )}
                </Nav>
              </Col>
              <Col sm={10}>
                <Tab.Content>
                  <Tab.Pane eventKey="details">
                    <form className="row g-3" onSubmit={(e) => addCustomer(e)}>
                      <h5 className="edit-customer-form-strips">
                        Personal Information
                      </h5>
                      {/* <div className="col-md-6">
                        <label className="form-label">
                          Store&nbsp;
                          <FaAsterisk size={"9px"} color="#283f68" />
                        </label>
                        <Select
                          options={userStores}
                          value={{
                            label: customer.store?.name,
                            value: customer.store?.id,
                          }}
                          onChange={(e) => {
                            setCustomer({
                              ...customer,
                              store: {
                                id: e.value,
                                name: e.label,
                              },
                            });
                          }}
                        />
                      </div> */}
                      <div className="col-md-6">
                        <label className="form-label">
                          First Name&nbsp;
                          <FaAsterisk size={"9px"} color="#283f68" />
                        </label>
                        <input
                          type="text"
                          className="form-control"
                          value={customer.firstName}
                          onChange={(e) =>
                            setCustomer({
                              ...customer,
                              firstName: e.target.value,
                            })
                          }
                        />
                      </div>
                      <div className="col-md-6">
                        <label className="form-label">
                          Last Name&nbsp;
                          <FaAsterisk size={"9px"} color="#283f68" />
                        </label>
                        <input
                          type="text"
                          className="form-control"
                          value={customer.lastName}
                          onChange={(e) =>
                            setCustomer({
                              ...customer,
                              lastName: e.target.value,
                            })
                          }
                        />
                      </div>
                      <div className="col-6">
                        <label className="form-label">
                          Email&nbsp;
                          <FaAsterisk size={"9px"} color="#283f68" />
                        </label>
                        <input
                          type="text"
                          className="form-control"
                          value={customer.email}
                          onChange={(e) =>
                            setCustomer({ ...customer, email: e.target.value })
                          }
                        />
                      </div>
                      <div className="col-6">
                        <label className="form-label">Mobile</label>
                        <input
                          type="text"
                          className="form-control"
                          value={customer.mobile}
                          onChange={(e) =>
                            setCustomer({ ...customer, mobile: e.target.value })
                          }
                        />
                      </div>
                      <div className="col-md-6">
                        <label className="form-label">Driver License</label>
                        <input
                          type="text"
                          className="form-control"
                          value={customer.driverLicense}
                          onChange={(e) =>
                            setCustomer({
                              ...customer,
                              driverLicense: e.target.value,
                            })
                          }
                        />
                      </div>
                      <h5 className="edit-customer-form-strips">Address</h5>
                      <div className="col-md-6">
                        <label className="form-label">Street 1</label>
                        <input
                          type="text"
                          className="form-control"
                          value={customer.line1}
                          onChange={(e) =>
                            setCustomer({ ...customer, line1: e.target.value })
                          }
                        />
                      </div>
                      <div className="col-md-6">
                        <label className="form-label">Street 2</label>
                        <input
                          type="text"
                          className="form-control"
                          value={customer.line2}
                          onChange={(e) =>
                            setCustomer({ ...customer, line2: e.target.value })
                          }
                        />
                      </div>
                      <div className="col-md-6">
                        <label className="form-label">City</label>
                        <input
                          type="text"
                          className="form-control"
                          value={customer.city}
                          onChange={(e) =>
                            setCustomer({ ...customer, city: e.target.value })
                          }
                        />
                      </div>
                      <div className="col-md-6">
                        <label className="form-label">State</label>
                        <input
                          type="text"
                          className="form-control"
                          value={customer.state}
                          onChange={(e) =>
                            setCustomer({ ...customer, state: e.target.value })
                          }
                        />
                      </div>
                      <div className="col-md-6">
                        <label className="form-label">Zip</label>
                        <input
                          type="text"
                          className="form-control"
                          value={customer.zip}
                          onChange={(e) =>
                            setCustomer({ ...customer, zip: e.target.value })
                          }
                        />
                      </div>
                      <h5 className="edit-customer-form-strips">
                        Customer Credit
                      </h5>
                      <div className="col-md-6">
                        <label className="form-label">Current Balance</label>
                        <div className="input-group mb-3">
                          <span className="input-group-text" id="basic-addon1">
                            $
                          </span>
                          <input
                            type="text"
                            className="form-control"
                            value={customer.currentBalance}
                            onChange={(e) =>
                              setCustomer({
                                ...customer,
                                currentBalance: e.target.value,
                              })
                            }
                            aria-label="Username"
                            aria-describedby="basic-addon1"
                          />
                        </div>
                      </div>
                      <div className="col-12 text-end">
                        <button type="submit" className="btn save-btn">
                          Save
                        </button>
                        &nbsp;&nbsp;
                        <Link className="btn btn-danger" to={"/customers"}>
                          Cancel
                        </Link>
                      </div>
                    </form>
                  </Tab.Pane>
                  {route.pathname !== "/add-customer" && (
                    <>
                      <Tab.Pane eventKey="notifications">
                        <div className="row page-header mt-2">
                          <div className="col-6">
                            <h2 className="heading-main-page">Notification</h2>
                          </div>
                          <div className="col-6 book-details-btn text-end">
                            <button
                              className="btn"
                              onClick={handleShowNotification}>
                              Add Notification
                            </button>
                          </div>
                        </div>

                        <TableWare
                          json={notifications}
                          tableColumns={headers}
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
                      </Tab.Pane>
                      {/* <Tab.Pane eventKey="sales">
                        <Table
                          headers={salesCustomer}
                          gridData={[{}, {}, {}, {}]}
                        />
                      </Tab.Pane>
                      <Tab.Pane eventKey="trades">Trades</Tab.Pane> */}
                    </>
                  )}
                </Tab.Content>
              </Col>
            </Row>
          </Tab.Container>
        </div>
      </div>

      {/* Notification */}
      <Modal
        show={showNotification}
        size="lg"
        onHide={handleCloseNotification}
        animation={true}>
        <Modal.Header closeButton>
          <Modal.Title>Add Notification</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div>
            <AsyncSelect
              cacheOptions
              loadOptions={loadOptions}
              placeholder="Search inventory..."
              onChange={handleSelect}
            />
          </div>

          <button
            className="notification-save"
            onClick={() => {
              updateNotification();
            }}>
            Submit
          </button>
        </Modal.Body>
      </Modal>
      {/* Notification */}
    </main>
  );
};

export default EditCustomer;
