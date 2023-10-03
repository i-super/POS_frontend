import React, { useEffect, useState } from "react";
import { AiFillDelete, AiOutlineEdit } from "react-icons/ai";
import Table from "../../../Components/Table/Table";
import { api } from "../../../Services/api-service";
import { Link } from "react-router-dom";
import notificationSvc from "../../../Services/notification";
import {
  LEFT_ALIGN,
  LEFT_ALIGN_WITH_BORDER,
  datatableStyle,
  paginationStyle,
} from "../../../Utils/Util";
import TableWare from "../../../Components/DataTable/TableWare.tsx";

const ShowUsers = () => {
  const [usersList, setUsersList] = useState([]);

  const [loading, setLoading] = useState(false);
  const [json, setJson] = useState([]);
  const [orderBy, setOrderBy] = useState(null);
  const [orderByDir, setOrderByDir] = useState(null);
  const [pageIndex, setPageIndex] = useState(1);
  const [pageSize, setPageSize] = useState(20);
  const [searchString, setSearchString] = useState("");
  const [totalCount, setTotalCount] = useState(0);

  useEffect(() => {
    getUsers();
  }, []);
  const usersHeader = [
    {
      id: "Role",
      name: "Role",
      selector: (row) => row.role,
      sortable: true,
      style: LEFT_ALIGN_WITH_BORDER,
    },
    {
      id: "First Name",
      name: "First Name",
      selector: (row) => row.firstName,
      sortable: true,
      style: LEFT_ALIGN,
    },
    {
      id: "Last Name",
      name: "Last Name",
      selector: (row) => row.lastName,
      sortable: true,
      style: LEFT_ALIGN,
    },
    {
      id: "Email",
      name: "Email",
      selector: (row) => row.email,
      sortable: true,
      style: LEFT_ALIGN,
    },
    {
      cell: (row) => {
        return (
          <>
            <div className="action-icons-edit-del">
              <span>
                <Link to={`/edit-user/${row.id}`}>
                  <AiOutlineEdit />
                </Link>
              </span>
              &nbsp;&nbsp;
              <span>
                <Link to="#" onClick={() => delUser(row.id)}>
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

  const getUsers = async () => {
    const response = await api.get("users");
    if (response && response.ok) {
      console.log(response.data);
      setUsersList(response.data.data);
    }
  };

  const delUser = async (id) => {
    const response = await api.delete(`users/${id}`);
    if (response && response.ok) {
      notificationSvc.success("User Deleted Successfully");
      getUsers();
    }
  };
  return (
    <main>
      <div className="container-fluid">
        <div className="row page-header mt-3">
          <div className="col-6">
            <h2 className="heading-main-page">Users</h2>
          </div>
          <div className="col-6 book-details-btn text-end">
            <Link className="btn" to={"/add-user"}>Add User</Link>
          </div>
        </div>

        <div className="table-responsive mt-3">
          <TableWare
            json={usersList}
            tableColumns={usersHeader}
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
    </main>
  );
};

export default ShowUsers;
