import React, { useEffect, useState } from "react";
import { AiFillDelete, AiOutlineEdit } from "react-icons/ai";
import { Link } from "react-router-dom";
import Table from "../../../../Components/Table/Table";
import { api } from "../../../../Services/api-service";
import notificationSvc from "../../../../Services/notification";

const ShowEmployees = () => {
  const [employees, setEmployees] = useState([]);

  useEffect(() => {
    getEmployees();
  }, []);
  const getEmployees = async () => {
    const response = await api.get("employee");
    if (response && response.ok) {
      console.log(response.data);
      setEmployees(response.data.data);
    }
  };

  const employeeHeader = [
    {
      Header: "Role",
      accessor: "role",
    },
    {
      Header: "First Name",
      accessor: "firstName",
    },
    {
      Header: "Last Name",
      accessor: "lastName",
    },
    {
      Header: "Email",
      accessor: "email",
    },
    {
      Header: "Stores",
      accessor: "stores",
      Cell: (props) => {
        return (
          <ul>
            {props.row.original.stores.map((store) => {
              return <li key={store.id}>{store.name}</li>;
            })}
          </ul>
        );
      },
    },
    {
      Header: "Action",
      accessor: "action",
      Cell: (props) => {
        return (
          <div className="action-icons-edit-del">
            <span>
              <Link to={`/add-employee/${props.row.original.id}`}>
                <AiOutlineEdit />
              </Link>
            </span>
            &nbsp;&nbsp;&nbsp;
            <span>
              <Link to="#" onClick={() => delEmployee(props.row.original.id)}>
                <AiFillDelete />
              </Link>
            </span>
          </div>
        );
      },
    },
  ];

  const delEmployee = async (id) => {
    const response = await api.delete(`employees/${id}`);
    if (response && response.ok) {
      notificationSvc.success("Employee Deleted Successfully.");
      getEmployees();
    }
  };

  return (
    <main>
      <div className="container-fluid">
        <h2>Employees</h2>
        <div className="table-responsive">
          <Table
            headers={employeeHeader}
            gridData={employees}
            pageSize={20}
            btnText="+"
            btnUrl={"/add-employee"}
          />
        </div>
      </div>
    </main>
  );
};

export default ShowEmployees;
