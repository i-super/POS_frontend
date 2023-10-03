import React, { useEffect, useState } from "react";
import {
  LEFT_ALIGN,
  LEFT_ALIGN_WITH_BORDER,
  datatableStyle,
  paginationStyle,
} from "../../Utils/Util";
import TableWare from "../../Components/DataTable/TableWare.tsx";
import { AiFillDelete, AiFillPrinter } from "react-icons/ai";
import { Link } from "react-router-dom";
import { api } from "../../Services/api-service";
import notificationSvc from "../../Services/notification";

const Categories = () => {
  const [loading, setLoading] = useState(false);
  const [json, setJson] = useState([]);
  const [orderBy, setOrderBy] = useState(null);
  const [orderByDir, setOrderByDir] = useState(null);
  const [pageIndex, setPageIndex] = useState(1);
  const [pageSize, setPageSize] = useState(20);
  const [searchString, setSearchString] = useState("");
  const [totalCount, setTotalCount] = useState(0);
  const [addCategories, setAddCategories] = useState({
    id: "",
    name: "",
  });
  const [categories, setCategories] = useState([]);

  const categoryHeaders = [
    {
      id: "ID",
      name: "ID",
      selector: (row) => row.id,
      sortable: true,
      style: LEFT_ALIGN_WITH_BORDER,
    },
    {
      id: "Category",
      name: "Category",
      selector: (row) => row.name,
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
                <Link
                  onClick={() => {
                    delCategory(row.id);
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

  useEffect(() => {
    getCategory();
  }, []);

  const addCategory = async (e) => {
    e.preventDefault();
    const response = await api.post("category", addCategories);
    if (response && response.status === 200) {
      notificationSvc.success("Categories Added");
      getCategory();
      setAddCategories({ id: "", name: "" });
    }
  };

  const getCategory = async () => {
    const response = await api.get("category");
    if (response && response.status === 200) {
      setCategories(response.data.data);
    }
  };

  const delCategory = async (id) => {
    const response = await api.delete(`category/${id}`);
    if (response && response.status === 200) {
      notificationSvc.success("Deleted Successfully.");
      getCategory();
    }
  };

  return (
    <div className="container-fluid">
      <form
        className="row page-header mt-3"
        onSubmit={(e) => {
          addCategory(e);
        }}>
        <div className="col-md-3">
          <h2 className="heading-main-page">Categories</h2>
        </div>

        <div className="col-md-3">
          <input
            type="text"
            className="form-control"
            placeholder="Enter ID"
            value={addCategories.id}
            onChange={(e) => {
              setAddCategories((prev) => ({ ...prev, id: e.target.value }));
            }}
          />
        </div>

        <div className="col-md-3">
          <input
            type="text"
            className="form-control"
            placeholder="Enter Category"
            value={addCategories.name}
            onChange={(e) => {
              setAddCategories((prev) => ({ ...prev, name: e.target.value }));
            }}
          />
        </div>

        <div className="col-md-3 book-details-btn">
          <button className="btn w-100">Add Category</button>
        </div>
      </form>

      <div className="add-categories">
        <TableWare
          json={categories}
          tableColumns={categoryHeaders}
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
  );
};

export default Categories;
