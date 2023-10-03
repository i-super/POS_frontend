import React, { useState } from "react";
import { RangeDatePicker } from "react-google-flight-datepicker";
import "react-google-flight-datepicker/dist/main.css";
import Select from "react-select";
import "./Drafts.css";
import {
  LEFT_ALIGN,
  LEFT_ALIGN_WITH_BORDER,
  datatableStyle,
  paginationStyle,
} from "../../../Utils/Util";
import TableWare from "../../../Components/DataTable/TableWare.tsx";
import { Link } from "react-router-dom";
import { AiFillPrinter, AiFillEdit } from "react-icons/ai";
import { GrTransaction } from "react-icons/gr";
import moment from "moment";
import { useEffect } from "react";
import { api } from "../../../Services/api-service";

const Drafts = () => {
  const timeOptions = [
    { value: "all", label: "All" },
    { value: "daily", label: "Daily" },
    { value: "monthly", label: "Monthly" },
    { value: "yearly", label: "Yearly" },
    { value: "custom", label: "Custom" },
  ];

  const [loading, setLoading] = useState(false);
  const [json, setJson] = useState([]);
  const [orderBy, setOrderBy] = useState(null);
  const [orderByDir, setOrderByDir] = useState(null);
  const [pageIndex, setPageIndex] = useState(1);
  const [pageSize, setPageSize] = useState(20);
  const [searchString, setSearchString] = useState("");
  const [totalCount, setTotalCount] = useState(0);

  const [timeFilter, setTimeFilter] = useState(timeOptions[0]);
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());

  const searchItem = (val) => {
    setPageIndex(1);
    setSearchString(val);
  };

  useEffect(() => {
    getHistory()
  }, []);

  const getHistory = async () => {
    const response = await api.get(`get-drafts?TransactionType=Draft`);
    if (response.ok) {
      setJson(response.data.data)
    }
  }

  const filterOption = [
    {
      Value: "cash_sale",
      label: "Cash Sale",
    },
    {
      Value: "card_sale",
      label: "Card Sale",
    },
    {
      Value: "Returns",
      label: "Returns",
    },
    {
      Value: "Trades",
      label: "Trades",
    },
  ];

  const transHist = [
    {
      id: "Sale ID",
      name: "Sale ID",
      selector: (row) => row.id,
      sortable: true,
      style: LEFT_ALIGN_WITH_BORDER,
    },
    {
      id: "Created On",
      name: "Created On",
      selector: (row) => moment(new Date(row.createdOn)).format("DD-MM-YYYY"),
      sortable: true,
      style: LEFT_ALIGN,
    },
    {
      id: "Location",
      name: "Location",
      selector: (row) => row.store?.name,
      sortable: true,
      style: LEFT_ALIGN,
    },
    {
      id: "Transaction Type",
      name: "Transaction Type",
      selector: (row) => row.TransactionType,
      sortable: true,
      style: LEFT_ALIGN,
    },
    {
      id: "Payment Type",
      name: "Payment Type",
      selector: (row) => row.PaymentType,
      sortable: true,
      style: LEFT_ALIGN,
    },
    {
      id: "Cart Qty",
      name: "Cart Qty",
      selector: (row) => row.inventory?.reduce((a, b) => a + b.quantity, 0),
      sortable: true,
      style: LEFT_ALIGN,
    },
    {
      id: "Customer",
      name: "Customer",
      selector: (row) => row.customer?.name,
      sortable: true,
      style: LEFT_ALIGN,
    },
    {
      id: "Amount",
      name: "Amount",
      selector: (row) => row.TotalAmountPaid,
      sortable: true,
      style: LEFT_ALIGN,
    },
    {
      cell: (row) => {
        return (
          <>
            <div className="action-icons-edit-del">
              <span>
                <Link to={`/new-sale/${row.id}`}>
                  <AiFillEdit />
                </Link>
              </span>
              &nbsp;&nbsp;
              <span>
                <Link>
                  <AiFillPrinter />
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
  return (
    <main>
      <div className="container-fluid">
        <div className="row page-header mt-3">
          <div className="col-6">
            <h2 className="heading-main-page">Transaction Draft</h2>
          </div>
          <div className="col-6 book-details-btn text-end">
            <button className="btn">Export CSV</button>
          </div>
        </div>

        <div className="row filter-transaction-history mt-3">
          <div className="col-12 col-sm-12 col-md-6 col-lg-3 col-xl-3 col-xxl-3">
            <Select
              options={timeOptions}
              value={timeFilter}
              onChange={setTimeFilter}
              placeholder="Time Filter"
            />
          </div>

          {timeFilter.value === "custom" && (
            <div className="col-12 col-sm-12 col-md-6 col-lg-3 col-xl-3 col-xxl-3">
              <RangeDatePicker
                startDate={new Date()}
                endDate={new Date()}
                // onChange={(startDate, endDate) =>
                //   onDateChange(startDate, endDate)
                // }
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
          )}

          <div className="col-12 col-sm-12 col-md-6 col-lg-3 col-xl-3 col-xxl-3">
            <Select placeholder="Filter" options={filterOption} />
          </div>

          <div className="col-12 col-sm-12 col-md-6 col-lg-3 col-xl-3 col-xxl-3">
            <input
              type="text"
              className="form-control"
              value={searchString}
              onChange={(e) => searchItem(e.target.value)}
              placeholder="Search here"
            />
          </div>
        </div>

        <div className="transac-hist-data mt-3">
          <div className="table-responsive">
            <TableWare
              json={json}
              tableColumns={transHist}
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

export default Drafts;
