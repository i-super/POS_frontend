import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Select from "react-select";
import { api } from "../../../Services/api-service";
import notificationSvc from "../../../Services/notification";

const Employees = () => {
  const navigate = useNavigate();
  const [employee, setEmployee] = useState({});
  const [storesList, setStoresList] = useState([]);
  const [selectStores, setSelectStores] = useState([]);

  const { id } = useParams();
  const empRole = [
    {
      value: "admin",
      label: "Admin",
    },
    {
      value: "store_manager",
      label: "Store Manager",
    },
    {
      value: "store_empluyee",
      label: "Store Employee",
    },
  ];

  useEffect(() => {
    getStores();

    if (id) {
      getEmployee();
    }
  }, []);

  const getEmployee = async () => {
    const response = await api.get(`employee/${id}`);
    if (response && response.ok) {
      console.log(response.data.data);
      setEmployee({
        ...response.data.data,
        role: {
          label: response.data.data.role,
          value: response.data.data.role,
        },
        stores: setSelectStores(
          response.data.data.stores.map((store) => ({
            label: store.name,
            value: store.id,
          }))
        ),
      });
    }
  };

  const getStores = async () => {
    const response = await api.get("store");
    if (response && response.ok) {
      const result = response.data.data;
      setStoresList(
        result.map((store) => ({
          value: store.id,
          label: store.name,
        }))
      );
    }
  };

  const addEmployee = async (e) => {
    e.preventDefault();

    if (!employee.role) {
      notificationSvc.error("Please Select Role");
      return;
    }

    if (id) {
      updateEmp();
      return;
    }
    const response = await api.post("employee", {
      ...employee,
      role: employee.role.value,
      stores: selectStores.map((store) => ({
        id: store.value,
        name: store.label,
      })),
    });
    if (response && response.ok) {
      notificationSvc.success("Employee Added Successfully");
      navigate("/employees");
    }
  };

  const updateEmp = async () => {
    const response = await api.put(`employee/${id}`, {
      ...employee,
      role: employee.role.value,
      stores: selectStores.map((store) => ({
        id: store.value,
        name: store.label,
      })),
    });
    if (response && response.ok) {
      notificationSvc.success("Employee Updated Successfully");
      navigate("/employees");
    }
  };

  return (
    <main>
      <div className="container-fluid">
        {/* <h3>Employees</h3> */}
        <form className="row g-3" onSubmit={(e) => addEmployee(e)}>
          <h5 className="edit-customer-form-strips">Employee Info</h5>
          <div className="col-md-6">
            <label className="form-label">Role</label>
            <Select
              options={empRole}
              value={employee.role}
              placeholder="Select Role"
              onChange={(e) => setEmployee({ ...employee, role: e })}
            />
          </div>
          <div className="col-md-6">
            <label className="form-label">First Name</label>
            <input
              type="text"
              className="form-control"
              onChange={(e) =>
                setEmployee({ ...employee, firstName: e.target.value })
              }
              value={employee.firstName}
            />
          </div>
          <div className="col-md-6">
            <label className="form-label">Last Name</label>
            <input
              type="text"
              className="form-control"
              onChange={(e) =>
                setEmployee({ ...employee, lastName: e.target.value })
              }
              value={employee.lastName}
            />
          </div>
          <div className="col-6">
            <label className="form-label">Email Address</label>
            <input
              type="text"
              className="form-control"
              value={employee.email}
              onChange={(e) =>
                setEmployee({ ...employee, email: e.target.value })
              }
            />
          </div>
          <div className="col-6">
            <label className="form-label">Password</label>
            <input
              type="password"
              className="form-control"
              value={employee.password}
              onChange={(e) =>
                setEmployee({ ...employee, password: e.target.value })
              }
            />
          </div>
          <div className="col-md-6">
            <label className="form-label">Stores</label>
            <Select
              closeMenuOnSelect={false}
              isMulti
              options={storesList}
              value={selectStores}
              onChange={(e) => setSelectStores(e)}
            />
          </div>

          <div className="col-12 text-end">
            <button
              type="submit"
              className="btn"
              style={{
                backgroundColor: "#656565",
                color: "#283f68;;fd",
              }}>
              Save
            </button>
          </div>
        </form>
      </div>
    </main>
  );
};

export default Employees;
