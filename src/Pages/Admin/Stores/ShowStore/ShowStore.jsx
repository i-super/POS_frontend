import React, { useEffect, useState } from "react";
import { AiFillDelete, AiOutlineEdit } from "react-icons/ai";
import { Link } from "react-router-dom";
import { async } from "rxjs";
import Table from "../../../../Components/Table/Table";
import { api } from "../../../../Services/api-service";
import notificationSvc from "../../../../Services/notification";
import "./ShowStore.css";
import {
  LEFT_ALIGN,
  LEFT_ALIGN_WITH_BORDER,
  datatableStyle,
  paginationStyle,
} from "../../../../Utils/Util";
import TableWare from "../../../../Components/DataTable/TableWare.tsx";

const ShowStore = () => {
  const [stores, setStores] = useState([]);

  const [loading, setLoading] = useState(false);
  const [json, setJson] = useState([]);
  const [orderBy, setOrderBy] = useState(null);
  const [orderByDir, setOrderByDir] = useState(null);
  const [pageIndex, setPageIndex] = useState(1);
  const [pageSize, setPageSize] = useState(20);
  const [searchString, setSearchString] = useState("");
  const [totalCount, setTotalCount] = useState(0);

  useEffect(() => {
    getStores();
  }, []);

  const storeHeader = [
    {
      id: "Store Owner",
      name: "Store Owner",
      selector: (row) => row.owner.name,
      sortable: true,
      style: LEFT_ALIGN_WITH_BORDER,
    },
    {
      id: "Store Name",
      name: "Store Name",
      selector: (row) => row.storeName,
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
      id: "City",
      name: "City",
      selector: (row) => row.city,
      sortable: true,
      style: LEFT_ALIGN,
    },
    {
      id: "Default Tax",
      name: "Default Tax",
      selector: (row) => row.defaultTax,
      sortable: true,
      style: LEFT_ALIGN,
    },
    {
      id: "Phone Number",
      name: "Phone Number",
      selector: (row) => row.phoneNumber,
      sortable: true,
      style: LEFT_ALIGN,
    },
    {
      id: "Return Policy",
      name: "Return Policy",
      selector: (row) => row.returnPolicy,
      sortable: true,
      style: LEFT_ALIGN,
    },
    {
      id: "Zip",
      name: "Zip",
      selector: (row) => row.zip,
      sortable: true,
      style: LEFT_ALIGN,
    },
    {
      id: "Logo",
      name: "Logo",
      selector: (row) => row.logo,
      sortable: true,
      style: LEFT_ALIGN,
    },
    {
      id: "Address",
      name: "Address",
      selector: (row) => `${row.line1 + row.line2}`,
      sortable: true,
      style: LEFT_ALIGN,
    },
    {
      cell: (row) => {
        return (
          <>
            <div className="action-icons-edit-del">
              <span>
                <Link to={`/edit-stores/${row.id}`}>
                  <AiOutlineEdit />
                </Link>
              </span>
              &nbsp;&nbsp;&nbsp;
              <span>
                <Link
                  to="#"
                  onClick={() => {
                    delStore(row.id);
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
    const response = await api.get("store");
    if (response && response.ok) {
      setStores(response.data.data);
    }
  };

  const delStore = async (id) => {
    const response = await api.delete(`store/${id}`);
    if (response && response.ok) {
      notificationSvc.success("Store Deleted Successfully.");
      getStores();
    }
  };
  return (
    <main>
      <div className="container-fluid">
        <div className="row page-header mt-3">
          <div className="col-6">
            <h2 className="heading-main-page">Stores</h2>
          </div>
          <div className="col-6 book-details-btn text-end">
            <Link className="btn" to={"/add-stores"}>
              Add Stores
            </Link>
          </div>
        </div>
        <div className="table-responsive mt-3">
          <TableWare
            json={stores}
            tableColumns={storeHeader}
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

export default ShowStore;
