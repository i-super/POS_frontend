import React, { useEffect, useState } from "react";
import Select from "react-select";
import { api } from "../../../Services/api-service";
import notificationSvc from "../../../Services/notification";
import { Link, useNavigate, useParams } from "react-router-dom";

const Users = () => {
  const userRole = [
    {
      value: "admin",
      label: "Admin",
    },
    {
      value: "store-owner",
      label: "Store Owner",
    },
    {
      value: "store_manager",
      label: "Store Manager",
    },
    {
      value: "employee",
      label: "Store Employee",
    },
  ];

  const [user, setUser] = useState({
    role: null,
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    stores: null,
  });

  // const [storesList, setStoresList] = useState([]);
  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    // getStore();
    if (id) {
      getUSer();
    }
  }, []);

  // const getStore = async () => {
  //   const response = await api.get("store");
  //   if (response && response.ok) {
  //     setStoresList(response.data.data);
  //   }
  // };

  const addUser = async (e) => {
    e.preventDefault();
    const response = await api.post("register", {
      ...user,
      role: user.role.value,
    });

    if (response && response.ok) {
      notificationSvc.success("User Added Successfully");
      navigate("/users");
    }
  };

  const getUSer = async () => {
    const response = await api.get(`users/${id}`);
    if (response && response.ok) {
      console.log(response.data);
      setUser({
        ...response.data.data,
        role: {
          value: response.data.data.role,
          label: response.data.data.role,
        },
      });
    }
  };

  return (
    <main>
      <div className="container-fluid">
        <div className="row page-header mt-3">
          <div className="col-6">
            <h2 className="heading-main-page">Users</h2>
          </div>
          {/* <div className="col-6 book-details-btn text-end">
            <Link className="btn">Add User</Link>
          </div> */}
        </div>
        <form className="row g-3" onSubmit={(e) => addUser(e)}>
          <div className="col-md-6">
            <label className="form-label">Role</label>
            <Select
              options={userRole}
              value={user.role}
              placeholder="Select Role"
              onChange={(e) => setUser({ ...user, role: e })}
            />
          </div>
          <div className="col-md-6">
            <label className="form-label">First Name</label>
            <input
              type="text"
              className="form-control"
              onChange={(e) => setUser({ ...user, firstName: e.target.value })}
              value={user.firstName}
            />
          </div>
          <div className="col-md-6">
            <label className="form-label">Last Name</label>
            <input
              type="text"
              className="form-control"
              onChange={(e) => setUser({ ...user, lastName: e.target.value })}
              value={user.lastName}
            />
          </div>
          <div className="col-6">
            <label className="form-label">Email Address</label>
            <input
              type="text"
              className="form-control"
              value={user.email}
              onChange={(e) => setUser({ ...user, email: e.target.value })}
            />
          </div>
          <div className="col-6">
            <label className="form-label">Password</label>
            <input
              type="password"
              className="form-control"
              value={user.password}
              onChange={(e) => setUser({ ...user, password: e.target.value })}
            />
          </div>

          <div className="col-12 text-end">
            <button type="submit" className="btn save-btn">
              Save
            </button>
            &nbsp;&nbsp;
            <Link className="btn btn-danger" to={"/Users"}>
              Cancel
            </Link>
          </div>
        </form>
      </div>
    </main>
  );
};

export default Users;
