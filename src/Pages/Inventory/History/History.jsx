import React, { useContext, useMemo, useState } from "react";
import "./History.css";
import Select from "react-select";
import Table from "../../../Components/Table/Table";
import {
  LEFT_ALIGN,
  LEFT_ALIGN_WITH_BORDER,
  datatableStyle,
  paginationStyle,
} from "../../../Utils/Util";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import TableWare from "../../../Components/DataTable/TableWare.tsx";
import { useEffect } from "react";
import { api } from "../../../Services/api-service";
import moment from "moment";
import { StoreContext } from "../../../Components/StoreContext";
const History = () => {
  const { selectedStore } = useContext(StoreContext);
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState([]);
  const [json, setJson] = useState([]);
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
  const [category, setCategory] = useState("")

  const inventHistory = [
    {
      id: "Date",
      name: "Date",
      selector: (row) => moment(new Date(row.createdOn)).format("DD-MM-YYYY"),
      sortable: true,
      style: LEFT_ALIGN_WITH_BORDER,
    },
    {
      id: "Activity",
      name: "Activity",
      selector: (row) => row.TransactionType,
      sortable: true,
      style: LEFT_ALIGN,
    },
    {
      id: "Category",
      name: "Category",
      selector: (row) => row?.product?.category,
      sortable: true,
      style: LEFT_ALIGN,
    },
    {
      id: "Product Name",
      name: "Product Name",
      selector: (row) => row?.product?.name,
      sortable: true,
      style: LEFT_ALIGN,
    },
    {
      id: "Sell Price",
      name: "Sell Price",
      selector: (row) => row.amount,
      sortable: true,
      style: LEFT_ALIGN,
    },
    {
      id: "Purchase Price",
      name: "Purchase Price",
      selector: (row) => row.cogs,
      sortable: true,
      style: LEFT_ALIGN,
    },
    {
      id: "Quantity",
      name: "Quantity",
      selector: (row) => row.quantity,
      sortable: true,
      style: LEFT_ALIGN,
    },
    {
      id: "Processed By",
      name: "Processed By",
      selector: (row) => row.processedBy,
      sortable: true,
      style: LEFT_ALIGN,
    },
  ];

  useEffect(() => {
    getCategories();
  }, [])

  useEffect(() => {
    if (selectedStore.value) {
      const start = moment(new Date()).startOf("day").toISOString();
      const end = moment(new Date()).endOf("day").toISOString();
      getHistory("All", start, end);
    }
  }, [selectedStore]);

  const getDaily = (date, value = option.value, cat) => {
    const start = moment(new Date(date)).startOf("day").toISOString();
    const end = moment(new Date(date)).endOf("day").toISOString();
    getHistory(value, start, end, cat);
  }

  const getMonthly = (date, value = option.value, cat) => {
    const start = moment().month(date).startOf("month").toISOString();
    const end = moment().month(date).endOf("month").toISOString();
    getHistory(value, start, end, cat);
  }
  const getYearly = (date, value = option.value, cat) => {
    const start = moment().year(date).startOf("year").toISOString();
    const end = moment().year(date).endOf("year").toISOString();
    getHistory(value, start, end, cat);
  }

  const getRange = async (e, value = option.value, cat) => {
    setRange(e)
    if (e.length > 1 && e[1]) {
      const start = moment(new Date(e[0])).startOf("day").toISOString();
      const end = moment(new Date(e[1])).endOf("day").toISOString();
      getHistory(value, start, end, cat)
    }

  }

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

  const handleCategoryChange = (e) => {
    setCategory(e)
    if (timeFilter === "Daily") {
      getDaily(timeFrame, option.value, e?.name)
    }
    if (timeFilter === "Monthly") {
      getMonthly(month, option.value, e?.name)
    }
    if (timeFilter === "Yearly") {
      getYearly(year, option.value, e?.name)
    }
    if (timeFilter === "Custom") {
      getRange([new Date(), new Date()], option.value, e?.name)
    }
  }

  const getHistory = async (type, startDate, endDate, cat) => {
    const response = await api.get(`transaction-history/${selectedStore.value}?type=${type}&startDate=${startDate}&endDate=${endDate}${cat ? `&category=${cat}` : ""}`);
    if (response.ok) {
      setJson(response.data.data);
    }
  };

  const getCategories = async () => {
    const response = await api.get('category');
    if (response.ok) {
      setCategories(response.data.data);
    }
  }

  const filterOption = [
    {
      value: "All",
      label: "All",
    },
    {
      value: "Sale",
      label: "Sale",
    },
    {
      value: "Return",
      label: "Return",
    },
    {
      value: "Trade",
      label: "Trade",
    },
    {
      value: "Add",
      label: "Add",
    },
    {
      value: "Delete",
      label: "Delete",
    },
  ];

  const timeOptions = [
    { value: "Daily", label: "Daily" },
    { value: "Monthly", label: "Monthly" },
    { value: "Yearly", label: "Yearly" },
    { value: "Custom", label: "Custom" },
  ];

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

  return (
    <main>
      <div className="container-fluid">
        <div className="row page-header">
          <div className="col-6">
            <h2 className="heading-main-page">Inventory History</h2>
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
            <Select placeholder="Activity Type" options={filterOption} value={option} onChange={(e) => { handleFilterMenuChange(e.value); setOption(e) }} />
          </div>

          <div className="col-12 col-sm-12 col-md-6 col-lg-3 col-xl-3 col-xxl-3">
            <Select placeholder="Category" options={categories} getOptionLabel={(e) => e.name} getOptionValue={(e) => e.id} isClearable value={category} onChange={(e) => handleCategoryChange(e)} />
          </div>

          <div className="col-12 col-sm-12 col-md-6 col-lg-3 col-xl-3 col-xxl-3">
            <input
              type="text"
              className="form-control"
              value={searchString}
              onChange={(e) => setSearchString(e.target.value)}
              placeholder="Search here"
            />
          </div>
        </div>

        {/* <div className="row mt-3">
          <div className="col-12 col-sm-12 col-md-6 col-lg-6 col-xl-6 col-xxl-6"></div>
          <div className="col-12 col-sm-12 col-md-6 col-lg-6 col-xl-6 col-xxl-6">
            <Select placeholder="All Stores" />
          </div>
        </div> */}

        <div className="inventory-history-table">
          <div className="table-responsive">
            <TableWare
              json={result}
              tableColumns={inventHistory}
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

export default History;
