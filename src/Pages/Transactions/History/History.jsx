import React, { useContext, useMemo, useState } from "react";
import { RangeDatePicker } from "react-google-flight-datepicker";
import "react-google-flight-datepicker/dist/main.css";
import Select from "react-select";
import "./History.css";
import {
  LEFT_ALIGN,
  LEFT_ALIGN_WITH_BORDER,
  datatableStyle,
  paginationStyle,
} from "../../../Utils/Util";
import TableWare from "../../../Components/DataTable/TableWare.tsx";
import { Link } from "react-router-dom";
import { AiFillPrinter } from "react-icons/ai";
import { GrTransaction } from "react-icons/gr";
import moment from "moment";
import { useEffect } from "react";
import { api } from "../../../Services/api-service";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { StoreContext } from "../../../Components/StoreContext";

const History = () => {
  const timeOptions = [
    { value: "Daily", label: "Daily" },
    { value: "Monthly", label: "Monthly" },
    { value: "Yearly", label: "Yearly" },
    { value: "Custom", label: "Custom" },
  ];
  const { selectedStore } = useContext(StoreContext)
  const [loading, setLoading] = useState(false);
  const [json, setJson] = useState([]);
  const [cogs, setCogs] = useState(0);
  const [price, setPrice] = useState(0);
  const [orderBy, setOrderBy] = useState(null);
  const [orderByDir, setOrderByDir] = useState(null);
  const [pageIndex, setPageIndex] = useState(1);
  const [pageSize, setPageSize] = useState(20);
  const [searchString, setSearchString] = useState("");
  const [totalCount, setTotalCount] = useState(0);
  const [option, setOption] = useState({ label: "All", value: "All" })
  const [timeFilter, setTimeFilter] = useState("Daily");
  const [timeFrame, setTimeFrame] = useState(new Date());
  const [dateRange, setRange] = useState([]);
  const [month, setMonth] = useState(moment().format("MMMM"));
  const [year, setYear] = useState("2023");

  const searchItem = (val) => {
    setPageIndex(1);
    setSearchString(val);
  };

  useEffect(() => {
    if (selectedStore) {
      const start = moment(new Date()).startOf("day").toISOString();
      const end = moment(new Date()).endOf("day").toISOString();
      getHistory("All", start, end);
    }
  }, [selectedStore]);

  const getDaily = (date, value = option.value) => {
    const start = moment(new Date(date)).startOf("day").toISOString();
    const end = moment(new Date(date)).endOf("day").toISOString();
    getHistory(value, start, end);
  }

  const getMonthly = (date, value = option.value) => {
    const start = moment().month(date).startOf("month").toISOString();
    const end = moment().month(date).endOf("month").toISOString();
    getHistory(value, start, end);
  }
  const getYearly = (date, value = option.value) => {
    const start = moment().year(date).startOf("year").toISOString();
    const end = moment().year(date).endOf("year").toISOString();
    getHistory(value, start, end);
  }

  const getRange = async (e, value = option.value) => {
    setRange(e)
    if (e.length > 1 && e[1]) {
      const start = moment(new Date(e[0])).startOf("day").toISOString();
      const end = moment(new Date(e[1])).endOf("day").toISOString();
      getHistory(value, start, end)
    }

  }

  const getHistory = async (type, startDate, endDate) => {
    const response = await api.get(`get-transaction/${selectedStore.value}?type=${type}&startDate=${startDate}&endDate=${endDate}`);
    if (response.ok) {
      setJson(response.data.data);
    }
  };

  const filterOption = [
    {
      value: "All",
      label: "All",
    },
    {
      value: "Transaction",
      label: "Sale",
    },
    {
      value: "Return",
      label: "Return",
    },
    {
      value: "Trade",
      label: "Trade",
    }
  ];

  const handleFilterMenuChange = async (e) => {
    if (timeFilter === "Daily") {
      getDaily(timeFrame, e)
    }
    if (timeFilter === "Monthly") {
      getMonthly(month, e)
    }
    if (timeFilter === "Yearly") {
      getYearly(year, e)
    }
    if (timeFilter === "Custom") {
      getRange([new Date(), new Date()], e)
    }
  }

  const handleChangeTimeFilter = (selectedOption) => {
    setTimeFilter(selectedOption.value);
    if (selectedOption.value === "Daily") {
      getDaily(timeFrame)
    }
    if (selectedOption.value === "Monthly") {
      getMonthly(month)
    }
    if (selectedOption.value === "Yearly") {
      getYearly(year)
    }
    if (selectedOption.value === "Custom") {
      getRange([new Date(), new Date()])
    }
  };

  let result = useMemo(() => {
    if (!searchString) return json;
    return json.filter((js) => JSON.stringify(js).toLowerCase().includes(searchString.toLowerCase()))
  }, [searchString, json])

  useEffect(() => {
    let sum = 0;
    let multiple = 0;
    result.forEach((rs) => {
      sum += rs.inventory.reduce((a, b) => a + (Number(b.cogs) * Number(b.quantity)), 0);
      multiple += rs.inventory.reduce((a, b) => a + (Number(b.price) * Number(b.quantity)), 0);
    })
    setCogs(sum);
    setPrice(multiple)
  }, [result])

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
      selector: (row) => row.type,
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
      selector: (row) => row.inventory?.reduce((a, b) => a + b.quantity, 0) || row.inventory?.reduce((a, b) => a + Number(b.price.quantity), 0),
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
      selector: (row) => Number(row.TotalAmountPaid).toFixed(2),
      sortable: true,
      style: LEFT_ALIGN,
    },
    {
      cell: (row) => {
        return (
          <>
            <div className="action-icons-edit-del">
              <span>
                <Link to={`/edit-inventory`}>
                  <GrTransaction />
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
            <h2 className="heading-main-page">Transaction History</h2>
          </div>
          <div className="col-6 book-details-btn text-end">
            <button className="btn">Export CSV</button>
          </div>
        </div>

        <div className="row filter-transaction-history mt-3">
          <div className="col-12 col-sm-12 col-md-6 col-lg-3 col-xl-3 col-xxl-3">
            <Select
              options={timeOptions}
              value={{ label: timeFilter, value: timeFilter }}
              onChange={(e) => handleChangeTimeFilter(e)}
              placeholder="Time Filter"
            />
          </div>
          <div className="col-12 col-sm-12 col-md-12 col-lg-3 col-xl-3 col-xxl-3">

            {timeFilter === "Daily" ? (
              <DatePicker
                className="filter-date form-control"
                selected={timeFrame}
                showMonthDropdown
                placeholderText="Select Date"
                onChange={(e) => { getDaily(e); setTimeFrame(e) }}
              />
            ) : timeFilter === "Custom" ? (<DatePicker
              className="filter-date form-control"
              selectsRange={true}
              startDate={dateRange[0]}
              endDate={dateRange[1]}
              value={dateRange}
              // selected={dateRange}
              showMonthDropdown
              placeholderText="Select Date"
              onChange={(e) => getRange(e)}
            />) : timeFilter === "Monthly" ? (
              <Select options={[
                "January",
                "February",
                "March",
                "April",
                "May",
                "June",
                "July",
                "August",
                "September",
                "October",
                "November",
                "December",
              ].map((op) => { return { label: op, value: op } })} value={{ label: month, value: month }} onChange={(e) => { getMonthly(e.value); setMonth(e.value) }} placeholder="Select Category" />
            ) : (
              <Select options={["2030", "2029", "2028", "2027", "2026", "2025", "2024", "2023", "2022", "2021", "2020", "2019", "2018", "2017", "2016", "2015"].map((op) => { return { label: op, value: op } })} value={{ label: year, value: year }} onChange={(e) => { getYearly(e.value); setYear(e.value) }} placeholder="Select Year" />
            )}
          </div>

          <div className="col-12 col-sm-12 col-md-6 col-lg-3 col-xl-3 col-xxl-3">
            <Select placeholder="Filter" options={filterOption} value={option} onChange={(e) => { handleFilterMenuChange(e.value); setOption(e) }} />
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
              json={result}
              tableColumns={transHist}
              customStyles={datatableStyle}
              paginationStyles={paginationStyle}
              enableSearch={false}
              loading={loading}
              enablePagination={totalCount > pageSize}
              pageIndex={pageIndex}
              pageSize={pageSize}
              totalCount={totalCount}
              cogs={cogs}
              price={price}
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
            <div>Total</div>
            <div>COGS: {Number(cogs).toFixed(2)}</div>
            <div>Sell: {Number(price).toFixed(2)}</div>
            <div>Net: {Number(price - cogs).toFixed(2)}</div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default History;
