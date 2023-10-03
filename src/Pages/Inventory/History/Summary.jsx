import React, { useContext, useState } from "react";
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
import { StoreContext } from "../../../Components/StoreContext";

const Summary = () => {
    const { selectedStore } = useContext(StoreContext)
    const timeOptions = [
        { value: "store", label: "By Store" },
        { value: "category", label: "By Category" },
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

    useEffect(() => {
        getHistory()
    }, []);

    useEffect(() => {
        if (timeFilter.value === "category") {
            getByCategory()
        }
    }, [selectedStore])

    const getHistory = async () => {
        const response = await api.get(`inventory-summary-store`);
        if (response.ok) {
            setJson(response.data.data)
        }
    }

    const getByCategory = async () => {
        const response = await api.get(`summary/${selectedStore.value}`);
        if (response.ok) {
            setJson(response.data.data)
        }
    }

    const handleChange = (val) => {
        setTimeFilter(val)
        if (val.value === "store") {
            getHistory()
        } else {
            getByCategory()
        }
    }


    const transHist = [
        {
            id: "Name",
            name: "Name",
            selector: (row) => row.name,
            sortable: true,
            style: LEFT_ALIGN_WITH_BORDER,
        },
        {
            id: "In Stock Quantity",
            name: "In Stock Quantity",
            selector: (row) => row.quantity,
            sortable: true,
            style: LEFT_ALIGN,
        },
        {
            id: "Cost",
            name: "Cost",
            selector: (row) => "$" + Number(row.purchase).toFixed(2),
            sortable: true,
            style: LEFT_ALIGN,
        },
        {
            id: "Price",
            name: "Price",
            selector: (row) => "$" + Number(row.sale).toFixed(2),
            sortable: true,
            style: LEFT_ALIGN,
        },
        {
            id: "Net",
            name: "Net",
            selector: (row) => "$" + Number(row.sale - row.purchase).toFixed(2),
            sortable: true,
            style: LEFT_ALIGN,
        }

    ];
    return (
        <main>
            <div className="container-fluid">
                <div className="row page-header mt-3">
                    <div className="col-6">
                        <h2 className="heading-main-page">Inventory Summary</h2>
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
                            onChange={handleChange}
                            placeholder="Time Filter"
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

export default Summary;
