import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Table from "../../Components/Table/Table";
import { AiOutlineEdit, AiFillDelete } from "react-icons/ai";
import { api } from "../../Services/api-service";
import notificationSvc from "../../Services/notification";
import {
  LEFT_ALIGN,
  LEFT_ALIGN_WITH_BORDER,
  datatableStyle,
  paginationStyle,
} from "../../Utils/Util";
import TableWare from "../../Components/DataTable/TableWare.tsx";

const Customer = () => {
  const [customers, setCustomers] = useState([]);

  const [loading, setLoading] = useState(false);
  const [json, setJson] = useState([]);
  const [orderBy, setOrderBy] = useState(null);
  const [orderByDir, setOrderByDir] = useState(null);
  const [pageIndex, setPageIndex] = useState(1);
  const [pageSize, setPageSize] = useState(20);
  const [searchString, setSearchString] = useState("");
  const [totalCount, setTotalCount] = useState(0);

  useEffect(() => {
    getCustomers();
  }, []);

  const headers = [
    {
      id: "First Name",
      name: "First Name",
      selector: (row) => row.firstName,
      sortable: true,
      style: LEFT_ALIGN_WITH_BORDER,
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
      id: "Current Balance",
      name: "Current Balance",
      selector: (row) => row.currentBalance,
      sortable: true,
      style: LEFT_ALIGN,
    },
    {
      id: "Driver License",
      name: "Driver License",
      selector: (row) => row.driverLicense,
      sortable: true,
      style: LEFT_ALIGN,
    },
    {
      id: "Address Line 1",
      name: "Address Line 1",
      selector: (row) => row.line1,
      sortable: true,
      style: LEFT_ALIGN,
    },

    {
      id: "Mobile",
      name: "Mobile",
      selector: (row) => row.mobile,
      sortable: true,
      style: LEFT_ALIGN,
    },
    {
      id: "State",
      name: "State",
      selector: (row) => row.state,
      sortable: true,
      style: LEFT_ALIGN,
    },

    {
      id: "Store",
      name: "Store",
      selector: (row) => row.store.name,
      sortable: true,
      style: LEFT_ALIGN,
    },
    {
      cell: (row) => {
        console.log("Row", row);
        return (
          <>
            <div className="action-icons-edit-del">
              <span>
                <Link to={`/edit-customer/${row.id}`}>
                  <AiOutlineEdit />
                </Link>
              </span>
              &nbsp;&nbsp;
              <span>
                <Link
                  onClick={() => {
                    delCustomer(row.id);
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

  const getCustomers = async () => {
    const response = await api.get("customer");
    if (response && response.ok) {
      setCustomers(response.data.data);
    }
  };

  const delCustomer = async (id) => {
    const response = await api.delete(`customer/${id}`);
    if (response && response.ok) {
      notificationSvc.success("Customer Deleted Successfully");
      getCustomers();
    }
  };

  return (
    <main>
      <div className="container-fluid">
        <div className="row page-header mt-3">
          <div className="col-6">
            <h2 className="heading-main-page">Customers</h2>
            <span>Total Customers : {customers.length.toString()}</span>
          </div>
          <div className="col-6 book-details-btn text-end">
            <Link className="btn" to={"/add-customer"}>
              Add Customer
            </Link>
          </div>
        </div>
        <div className="see-customer mt-3">
          <div className="table-responsive">
            <TableWare
              json={customers}
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
          </div>
        </div>
      </div>
    </main>
  );
};

export default Customer;
