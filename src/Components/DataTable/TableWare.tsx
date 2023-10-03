import React, { useEffect, useMemo, useState, useCallback } from "react";
import DataTable, { TableColumn } from "react-data-table-component";
import "./TableWare.css";

interface PropsCustomTable {
  json: any[];
  tableColumns?: TableColumn<any>[];
  customStyles?: object;
  paginationStyles?: any;
  loading?: boolean;
  loadingText?: string;
  loadingTextStyle?: any;
  enableSearch?: boolean;
  enablePagination?: boolean;
  sortServer?: boolean;
  paginationServer?: boolean;
  pageIndex?: number;
  pageSize?: number;
  totalCount?: number;
  onSearchChange?: any;
  onSortChange?: any;
  onPageChange?: any;
  handleRowClick?: any;
  handleActionButtonClick?: any;
}

export const defaultStyle = {
  rows: {
    style: {
      minHeight: "32px",
      borderBottom: "0px !important",
    },
  },
  headRow: {
    style: {
      minHeight: "32px",
      backgroundColor: "#d7d8e1",
      borderTop: "0.5pt solid #ccc !important",
      borderBottom: "none !important",
    },
    denseStyle: {
      minHeight: "24px",
    },
  },
  headCells: {
    style: {
      fontSize: "9pt",
      border: "0.5pt solid #ccc !important",
      borderTop: "none !important",
      borderRight: "none !important",
      paddingLeft: "8px",
      paddingRight: "8px",
    },
  },

  cells: {
    style: {
      minHeight: "30px",
      fontSize: "9pt",
      border: "0.5pt solid #d7d8e1 !important",
      borderTop: "none !important",
      borderRight: "none !important",
      paddingLeft: "8px",
      paddingRight: "8px !important",
    },
    denseStyle: {
      minHeight: "30px",
    },
  },
};

export const paginationDefaultStyle = {
  pagination: {
    marginTop: "5px",
    justifyContent: "flex-end",
    display: "flex",
  },
  button: {
    height: "32px",
    color: "rgba(0, 0, 0, 0.87)",
    border: "1px solid #ccc",
    backgroundColor: "white",
  },
  active: {
    backgroundColor: "rgb(215, 216, 225)",
    border: "1px solid rgb(215, 216, 225)",
  },
  inactive: {
    backgroundColor: "#FFFFFF",
  },
  hoverColor: "#d7d8e1",
};

export const defaultLoadingTextStyle = {
  fontSize: "20px",
  marginTop: "10px",
};

const TableWare: React.FC<PropsCustomTable> = ({
  json = [],
  tableColumns = [],
  enableSearch = true,
  customStyles = defaultStyle,
  enablePagination = true,
  paginationServer = true,
  sortServer = true,
  pageIndex = 1,
  pageSize = 20,
  totalCount = 0,
  paginationStyles = paginationDefaultStyle,
  loading,
  loadingTextStyle = defaultLoadingTextStyle,
  loadingText = "Loading...",
  onSearchChange,
  onSortChange,
  onPageChange,
  handleRowClick,
}) => {
  const [filterText, setFilterText] = useState("");
  const [currentPage, setCurrentPage] = useState(pageIndex);
  const buttonRef = useCallback((node: any) => {
    if (paginationStyles.hoverColor && node) {
      node.style.setProperty(
        "--pagination-hover-color",
        paginationStyles.hoverColor
      );
    }
  }, []);
  const progressComponent = <div style={loadingTextStyle}>{loadingText}</div>;
  const toPages = (pages: any = []) => {
    const results: any[] = [];
    for (let i = 1; i <= pages; i++) {
      results.push(i);
    }
    return results;
  };
  const handlePageChange = (page: any) => {
    onPageChange(page);
  };
  const paginationComponent = ({ rowCount, currentPage }: any) => {
    const handleBackButtonClick = () => {
      handlePageChange(currentPage - 1);
      setCurrentPage(currentPage - 1);
    };

    const handleNextButtonClick = () => {
      handlePageChange(currentPage + 1);
      setCurrentPage(currentPage + 1);
    };

    const handlePageNumber = (e: any) => {
      handlePageChange(Number(e.target.value));
      setCurrentPage(Number(e.target.value));
    };

    const pages = Math.ceil(rowCount / pageSize);
    const pageItems = toPages(pages);
    const nextDisabled = currentPage === pageItems.length;
    const previousDisabled = currentPage === 1;

    return (
      <nav>
        <ul
          className="jkc-custom-data-table-pagination"
          style={paginationStyles.pagination}
        >
          <li>
            <button
              ref={buttonRef}
              style={paginationStyles.button}
              className="next-prev-btn"
              onClick={handleBackButtonClick}
              disabled={previousDisabled}
              aria-disabled={previousDisabled}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
              >
                <path
                  d="M14 17a1 1 0 0 1-.707-.293l-4-4a1 1 0 0 1 0-1.414l4-4a1 1 0 1 1 1.414 1.414L11.414 12l3.293 3.293A1 1 0 0 1 14 17z"
                  style={{ fill: "#1c1b1e" }}
                />
              </svg>
            </button>
          </li>
          {pageItems.map((page) => {
            return (
              <li key={page}>
                <button
                  ref={buttonRef}
                  disabled={page === currentPage}
                  value={page}
                  onClick={handlePageNumber}
                  style={
                    page === currentPage
                      ? {
                          ...paginationStyles.button,
                          ...paginationStyles.active,
                        }
                      : {
                          ...paginationStyles.button,
                          ...paginationStyles.inactive,
                        }
                  }
                >
                  {page}
                </button>
              </li>
            );
          })}
          <li>
            <button
              ref={buttonRef}
              style={paginationStyles.button}
              className="next-prev-btn"
              onClick={handleNextButtonClick}
              disabled={nextDisabled}
              aria-disabled={nextDisabled}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
              >
                <path
                  d="m14.707 12.707-4 4a1 1 0 0 1-1.414-1.414L12.586 12 9.293 8.707a1 1 0 1 1 1.414-1.414l4 4a1 1 0 0 1 0 1.414z"
                  style={{ fill: "#1c1b1e" }}
                />
              </svg>
            </button>
          </li>
        </ul>
      </nav>
    );
  };
  const clearFilter = () => {
    setFilterText("");
    onSearchChange(null);
  };
  const headerComponent = useMemo(() => {
    return (
      enableSearch && (
        <SearchTextBox
          onFilter={async (e: { target: { value: any } }) => {
            setFilterText(e.target.value);
            onSearchChange(e.target.value);
          }}
          clearFilter={clearFilter}
          filterText={filterText}
        />
      )
    );
  }, [filterText]);
  const handleSort = async (column: any, sortDirection: any) => {
    column.id && onSortChange(column.id, sortDirection);
  };

  return (
    <React.Fragment>
      <div className="jkc-custom-data-table-header">{headerComponent}</div>
      <div className="jkc-custom-data-table">
        <DataTable
          responsive={true}
          customStyles={customStyles}
          columns={tableColumns}
          data={json}
          onSort={handleSort}
          sortServer={sortServer}
          onRowClicked={handleRowClick}
          persistTableHead
          progressPending={loading}
          progressComponent={progressComponent}
          pagination={enablePagination}
          paginationServer={paginationServer}
          paginationDefaultPage={currentPage}
          paginationPerPage={pageSize}
          paginationTotalRows={totalCount}
          paginationComponent={paginationComponent}
        />
      </div>
    </React.Fragment>
  );
};

const SearchTextBox = ({ filterText, onFilter, clearFilter }: any) => (
  <React.Fragment>
    <label className="jkc-custom-data-table-search-input">
      <input
        value={filterText}
        style={{ fontSize: "14px" }}
        onChange={onFilter}
        type="text"
        placeholder="Search"
        name="name"
      />
      {filterText && (
        <svg
          onClick={clearFilter}
          className="jkc-custom-data-table-search-clear-icon"
          xmlns="http://www.w3.org/2000/svg"
          x="0px"
          y="0px"
          width="15"
          height="15"
          viewBox="0 0 48 48"
        >
          <path d="M 39.486328 6.9785156 A 1.50015 1.50015 0 0 0 38.439453 7.4394531 L 24 21.878906 L 9.5605469 7.4394531 A 1.50015 1.50015 0 0 0 8.484375 6.984375 A 1.50015 1.50015 0 0 0 7.4394531 9.5605469 L 21.878906 24 L 7.4394531 38.439453 A 1.50015 1.50015 0 1 0 9.5605469 40.560547 L 24 26.121094 L 38.439453 40.560547 A 1.50015 1.50015 0 1 0 40.560547 38.439453 L 26.121094 24 L 40.560547 9.5605469 A 1.50015 1.50015 0 0 0 39.486328 6.9785156 z"></path>
        </svg>
      )}
    </label>
  </React.Fragment>
);

export default TableWare;
