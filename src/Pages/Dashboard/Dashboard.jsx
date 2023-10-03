import React, { useContext, useEffect, useState } from "react";
import ApexCharts from "react-apexcharts";
import Select from "react-select";
import DatePicker from "react-datepicker";
import "./Dashboard.css";
import "react-datepicker/dist/react-datepicker.css";
import Col from "react-bootstrap/Col";
import Nav from "react-bootstrap/Nav";
import Row from "react-bootstrap/Row";
import Tab from "react-bootstrap/Tab";

import TableWare from "../../Components/DataTable/TableWare.tsx";

import { datatableStyle, paginationStyle } from "../../Utils/Util";
import { storeColumns } from "../../Utils/TableColumns";
import { StoreContext } from "../../Components/StoreContext";
import { api } from "../../Services/api-service";
import moment from "moment";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
  const { selectedStore } = useContext(StoreContext);
  const navigate = useNavigate()
  const [timeFilter, setTimeFilter] = useState("Daily");
  const [month, setMonth] = useState(moment().format("MMMM"));
  const [year, setYear] = useState("2023");
  const [glance, setGlance] = useState({ transaction: 0, total: 0, trades: 0 });
  const [stats, setStats] = useState([]);
  const [catStats, setCatStats] = useState([]);
  const [loading, setLoading] = useState(false);
  const [json, setJson] = useState([]);
  const [orderBy, setOrderBy] = useState(null);
  const [orderByDir, setOrderByDir] = useState(null);
  const [pageIndex, setPageIndex] = useState(1);
  const [pageSize, setPageSize] = useState(20);
  const [timeFrame, setTimeFrame] = useState(new Date());
  const [searchString, setSearchString] = useState("");
  const [totalCount, setTotalCount] = useState(0);

  useEffect(() => {
    if (selectedStore) {
      getAtAGlanceDaily(timeFrame);
      getStoreStatsDaily(timeFrame);
      getDaily(timeFrame)
      getCategoryStatsDaily(timeFrame);
    }
  }, [selectedStore]);

  console.log(stats)

  const handleChangeTimeFilter = (selectedOption) => {
    setTimeFilter(selectedOption.value);
    if (selectedOption.value === "Daily") {
      getAtAGlanceDaily(timeFrame)
      getStoreStatsDaily(timeFrame)
      getDaily(timeFrame)
      getCategoryStatsDaily(timeFrame)
    }
    if (selectedOption.value === "Monthly") {
      getAtAGlanceMonthly(moment().format("MMMM"))
      getStoreStatsMonthly(moment().format("MMMM"))
      getMonthly(moment().format("MMMM"))
      getCategoryStatsMonthly(moment().format("MMMM"))
    }
    if (selectedOption.value === "Yearly") {
      getAtAGlanceYearly(moment().format("YYYY"));
      getStoreStatsYearly(moment().format("YYYY"));
      getYearly(moment().format("YYYY"))
      getCategoryStatsYearly(moment().format("YYYY"))
    }
  };

  const getStoreStatsDaily = async (date) => {
    const start = moment(new Date(date)).startOf("day").toISOString();
    const end = moment(new Date(date)).endOf("day").toISOString();
    const response = await api.get(
      `get-store-stats?startDate=${start}&endDate=${end}`
    );
    if (response.ok) {
      setStats(response.data.data);
    }
  }
  const getStoreStatsMonthly = async (date) => {
    const start = moment().month(date).startOf("month").toISOString();
    const end = moment().month(date).endOf("month").toISOString();
    const response = await api.get(
      `get-store-stats?startDate=${start}&endDate=${end}`
    );
    if (response.ok) {
      setStats(response.data.data);
    }
  }
  const getStoreStatsYearly = async (date) => {
    const start = moment().year(date).startOf("year").toISOString();
    const end = moment().year(date).endOf("year").toISOString();
    const response = await api.get(
      `get-store-stats?startDate=${start}&endDate=${end}`
    );
    if (response.ok) {
      setStats(response.data.data);
    }
  }
  const getCategoryStatsDaily = async (date) => {
    const start = moment(new Date(date)).startOf("day").toISOString();
    const end = moment(new Date(date)).endOf("day").toISOString();
    const response = await api.get(
      `by-category-stats/${selectedStore.value}?startDate=${start}&endDate=${end}`
    );
    if (response.ok) {
      setCatStats(response.data.data);
    }
  }
  const getCategoryStatsMonthly = async (date) => {
    const start = moment().month(date).startOf("month").toISOString();
    const end = moment().month(date).endOf("month").toISOString();
    const response = await api.get(
      `by-category-stats/${selectedStore.value}?startDate=${start}&endDate=${end}`
    );
    if (response.ok) {
      setCatStats(response.data.data);
    }
  }
  const getCategoryStatsYearly = async (date) => {
    const start = moment().year(date).startOf("year").toISOString();
    const end = moment().year(date).endOf("year").toISOString();
    const response = await api.get(
      `by-category-stats/${selectedStore.value}?startDate=${start}&endDate=${end}`
    );
    if (response.ok) {
      setCatStats(response.data.data);
    }
  }

  const getAtAGlanceDaily = async (date) => {
    const start = moment(new Date(date)).startOf("day").toISOString();
    const end = moment(new Date(date)).endOf("day").toISOString();
    const response = await api.get(
      `at-a-glance/${selectedStore.value}?startDate=${start}&endDate=${end}`
    );
    if (response.ok) {
      setGlance(response.data.data);
    }
  };

  const getAtAGlanceMonthly = async (date) => {
    const start = moment().month(date).startOf("month").toISOString();
    const end = moment().month(date).endOf("month").toISOString();
    const response = await api.get(
      `at-a-glance/${selectedStore.value}?startDate=${start}&endDate=${end}`
    );
    if (response.ok) {
      setGlance(response.data.data);
    }
  };

  const getAtAGlanceYearly = async (date) => {
    const start = moment().year(date).startOf("year").toISOString();
    const end = moment().year(date).endOf("year").toISOString();
    const response = await api.get(
      `at-a-glance/${selectedStore.value}?startDate=${start}&endDate=${end}`
    );
    if (response.ok) {
      setGlance(response.data.data);
    }
  };

  const handleTimeframeChange = (date) => {
    setTimeFrame(date);
    getAtAGlanceDaily(date);
    getDaily(date)
  };

  const handleMonthChange = (date) => {
    setMonth(date);
    getAtAGlanceMonthly(date);
    getStoreStatsMonthly(date);
    getMonthly(date)
  };

  const handleYearChange = (date) => {
    setYear(date);
    getAtAGlanceYearly(date);
    getStoreStatsYearly(date);
    getYearly(date)
  };

  const getDaily = (date) => {
    const start = moment(new Date(date)).startOf("day").toISOString();
    const end = moment(new Date(date)).endOf("day").toISOString();
    getHistory("Transaction", start, end);
  }

  const getMonthly = (date) => {
    const start = moment().month(date).startOf("month").toISOString();
    const end = moment().month(date).endOf("month").toISOString();
    getHistory("Transaction", start, end);
  }
  const getYearly = (date) => {
    const start = moment().year(date).startOf("year").toISOString();
    const end = moment().year(date).endOf("year").toISOString();
    getHistory("Transaction", start, end);
  }

  const getHistory = async (type, startDate, endDate) => {
    const response = await api.get(`get-transaction/${selectedStore.value}?type=${type}&startDate=${startDate}&endDate=${endDate}`);
    if (response.ok) {
      setJson(response.data.data);
    }
  };

  const getLineChartConfig = (filter) => {
    let labels = [];
    let data = [];
    return {
      options: {
        chart: {
          height: 350,
          type: "line",
          toolbar: {
            show: false,
          },
        },
        xaxis: { type: 'datetime', name: "Sales" },
        tooltip: { x: { show: true } },
        stroke: { curve: "smooth" },
      },
      series: [{
        name: "Sales",
        data: json.map((js) => { return { x: new Date(js.createdOn).getTime(), y: js.TotalAmountPaid } })
      }],
    };
  };

  const { options, series } = getLineChartConfig(timeFilter);

  console.log(series)

  console.log(options, series);

  const categories = [
    {
      value: "video_games",
      label: "Video Games",
    },
    {
      value: "trading_cards",
      label: "Trading Cards",
    },
    {
      value: "custom",
      label: "Custom",
    },
  ];

  const stores = [
    {
      value: "retro_rewind",
      label: "Retro Rewind",
    },
  ];

  const [key, setKey] = useState("byStore");

  return (
    <main>
      <div className="container-fluid">
        <h1 className="heading-main-page">Dashboard</h1>

        <div className="row filter-strip">
          <div className="col-12 col-sm-12 col-md-12 col-lg-3 col-xl-3 col-xxl-3">
            <Select
              options={["Daily", "Monthly", "Yearly"].map((op) => {
                return { label: op, value: op };
              })}
              onChange={handleChangeTimeFilter}
              value={{ label: timeFilter, value: timeFilter }}
              placeholder="Month or Year"
            />
          </div>
          <div className="col-12 col-sm-12 col-md-12 col-lg-3 col-xl-3 col-xxl-3">
            {timeFilter === "Daily" ? (
              <DatePicker
                className="filter-date form-control"
                selected={timeFrame}
                showMonthDropdown
                placeholderText="Select Date"
                onChange={handleTimeframeChange}
              />
            ) : timeFilter === "Monthly" ? (
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
              ].map((op) => { return { label: op, value: op } })} value={{ label: month, value: year }} onChange={(e) => handleMonthChange(e.value)} placeholder="Select Category" />
            ) : (
              <Select options={["2030", "2029", "2028", "2027", "2026", "2025", "2024", "2023", "2022", "2021", "2020", "2019", "2018", "2017", "2016", "2015"].map((op) => { return { label: op, value: op } })} value={{ label: year, value: year }} onChange={(e) => handleYearChange(e.value)} placeholder="Select Category" />
            )}
          </div>
        </div>

        {/* <p>Showing sales data for: {timeframe}</p> */}

        <div className="row statistics">
          <div className="col-12 col-sm-12 col-md-6 col-lg-6 col-xl-6 col-xxl-6">
            <div className="stats-chart">
              <ApexCharts options={options} series={series} type="line" />
            </div>
          </div>

          <div className="col-12 col-sm-12 col-md-6 col-lg-4 col-xl-4 col-xxl-4 stats-figures">
            <h3 className="at-glance">AT A GLANCE</h3>

            <div className="stats-mid ">
              <div className="status-dashboard">
                <h4>Total Sales:</h4>
                <p>${Number(glance.total).toFixed(2)}</p>
              </div>
              <hr />
              <div className="status-dashboard">
                <h4>Sales:</h4>
                <p className="dashboard-count">{glance.transaction}</p>
              </div>
              <hr />
              <div className="status-dashboard">
                <h4>Trade Ins:</h4>
                <p>{glance.trades}</p>
              </div>
            </div>
          </div>

          <div className="col-12 col-sm-12 col-md-6 col-lg-2 col-xl-2 col-xxl-2">
            <div className="Quick-actions-main h-100">
              <h6 className="quick-actions-dashboard">Quick Actions</h6>
              <div className="action-position">
                <div className="quick-action mb-3">
                  <button onClick={() => navigate("/new-sale")}>Sell/Trade</button>
                </div>
                <div className="quick-action mb-3">
                  <button onClick={() => navigate("/inventory-items")}>Add Inventory</button>
                </div>
                <div className="quick-action">
                  <button onClick={() => navigate("/new-return")}>Return an Item</button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="dash-details">
          <Tab.Container
            id="left-tabs-example"
            defaultActiveKey="byStore"
            onSelect={(k) => setKey(k)}
          >
            <Row>
              <Col sm={2} className="dash-details-sidebar">
                <Nav variant="pills" className="flex-column ">
                  <Nav.Item>
                    <Nav.Link eventKey="byStore">By Store</Nav.Link>
                  </Nav.Item>
                  <Nav.Item>
                    <Nav.Link eventKey="byCategory">By Category</Nav.Link>
                  </Nav.Item>
                </Nav>
              </Col>
              <Col sm={10}>
                <Tab.Content>
                  <Tab.Pane eventKey="byStore">
                    <div className="table-responsive">
                      <TableWare
                        json={stats}
                        tableColumns={storeColumns}
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
                  </Tab.Pane>
                  <Tab.Pane eventKey="byCategory">
                    <div className="table-responsive">
                      <TableWare
                        json={catStats}
                        tableColumns={storeColumns}
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
                  </Tab.Pane>
                </Tab.Content>
              </Col>
            </Row>
          </Tab.Container>
        </div>
      </div>
    </main>
  );
};

export default Dashboard;
