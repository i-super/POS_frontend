import { Icon } from "@iconify/react";
import React, { useEffect, useMemo, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { useGlobalFilter, usePagination, useTable } from "react-table";

export default function Table({
  pageSize,
  checked,
  headers,
  gridData,
  btnText,
  btnUrl,
  search,
}) {
  var totalPages = 0;
  const [selectedPage, setSelectedPage] = useState(0);
  const data = useMemo(() => gridData, [gridData]);
  totalPages = data ? Math.ceil(data.length / pageSize) : 0;
  const columns = React.useMemo(() => headers, [headers]);
  let pageIn = useRef();
  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    prepareRow,
    page,
    canNextPage,
    nextPage,
    gotoPage,
    previousPage,
    canPreviousPage,
    state: { pageIndex, globalFilter },
    setGlobalFilter,
  } = useTable(
    {
      columns,
      data,
      initialState: { pageSize: pageSize },
    },
    useGlobalFilter,
    usePagination
  );
  pageIn.current = pageIndex;

  const handleButtonClick = (e) => {
    if (typeof btnUrl === "function") {
      e.preventDefault();
      btnUrl();
    }
  };
  const handlePageChange = (e) => {
    const newPage = parseInt(e.target.value, 10) - 1;
    if (!isNaN(newPage) && newPage >= 0 && newPage < totalPages) {
      setSelectedPage(newPage);
      gotoPage(newPage)
    }
  };
  return (
    <>
      <>
        <div className="row">
          <div className="col-lg-6">
            {search && (
              <input
                type="text"
                className="form-control w-50 mb-3"
                placeholder="Search"
                value={globalFilter || ""}
                onChange={(e) => setGlobalFilter(e.target.value)}
              />
            )}
          </div>
          <div className="col-lg-6">
            <div className="text-end">
              {btnText && (
                <Link
                  to={typeof btnUrl === "string" ? btnUrl : "#"}
                  className="btn table-btnTxt"
                  onClick={handleButtonClick}>
                  {btnText}
                </Link>
              )}
            </div>
          </div>
        </div>

        <table {...getTableProps()} style={{ width: "100%", marginTop: "10px" }}>
          <thead>
            {headerGroups.map((headerGroup) => (
              <tr {...headerGroup.getHeaderGroupProps()}>
                {headerGroup.headers.map((column) => (
                  <th {...column.getHeaderProps()}>
                    {column.render("Header")}
                    {/* Render the columns filter UI */}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody {...getTableBodyProps()}>
            {page.map((row, i) => {
              prepareRow(row);
              return (
                <tr {...row.getRowProps()}>
                  {row.cells.map((cell) => {
                    return (
                      <td {...cell.getCellProps()}>{cell.render("Cell")}</td>
                    );
                  })}
                </tr>
              );
            })}
          </tbody>
        </table>
      </>
      {totalPages > 1 && <nav aria-label="Page navigation example">
        <ul className="pagination">
          <li className="page-item">
            <Link
              to=""
              className={`page-link ${!canPreviousPage && `disabled`}`}
              onClick={() => previousPage()}>
              <Icon icon="grommet-icons:form-previous" />
            </Link>
          </li>
          <li className="page-item">
            <Link
              to=""
              className={`page-link ${!canNextPage && `disabled`}`}
              disabled={!canNextPage}
              onClick={() => nextPage()}>
              <Icon icon="grommet-icons:form-next" />
            </Link>
          </li>

          <li className="ms-3 page-item">
            <span>
              Page&nbsp;
              <strong>
                {pageIndex >= 0 ? `${pageIndex + 1} ` : `${pageIndex} `} of
                &nbsp;
                {totalPages}
              </strong>
            </span>
          </li>
          <li className="ms-3 page-item">
            <select
              className="form-select"
              value={selectedPage + 1} // Step 3: Bind select to selectedPage
              onChange={handlePageChange} // Step 2: Handle page change
            >
              {Array.from({ length: totalPages }, (_, i) => (
                <option key={i} value={i + 1}>
                  {i + 1}
                </option>
              ))}
            </select>
          </li>
        </ul>
      </nav>}
    </>
  );
}

export const GlobalFilter = ({ setFilter }) => {
  const [filter, setFilterText] = useState("");
  useEffect(() => {
    setFilter(filter);
  }, [filter, setFilter]);
  return (
    <div className="filterSearch">
      <form className="tableSearch">
        <input
          type="search"
          className="form-control"
          value={filter || ""}
          onChange={(e) => setFilterText(e.target.value)}
          placeholder="Search"
        />
      </form>
    </div>
  );
};
