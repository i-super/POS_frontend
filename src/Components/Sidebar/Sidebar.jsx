import React from "react";
import "./Sidebar.css";
import { AiOutlineStock, AiFillDollarCircle } from "react-icons/ai";
import { BsPeopleFill } from "react-icons/bs";
import { MdOutlineChangeHistory } from "react-icons/md";
import { RiAdminLine } from "react-icons/ri";
import { GrUserAdmin } from "react-icons/gr";
import { Link } from "react-router-dom";
const Sidebar = () => {
  return (
    <div
      className="offcanvas offcanvas-start sidebar-nav proximeet-sidebar"
      tabIndex={-1}
      id="sidebar">
      <div className="offcanvas-body p-0">
        <nav className="navbar-dark">
          <ul className="navbar-nav">
            {/* <li>
              <Link to="/" className="nav-link px-3">
                <span className="me-2">
                  <i className="bi bi-speedometer2" />
                </span>
                <span>Dashboard</span>
              </Link>
            </li> */}

            {/* <li>
              <a
                className="nav-link px-3 sidebar-link"
                data-bs-toggle="collapse"
                href="#layouts">
                <span className="me-2">
                  <i className="bi bi-cash-stack"></i>
                </span>
                <span>Transactions</span>&nbsp;&nbsp;
                <span className="ms-auto">
                  <span className="right-icon">
                    <i className="bi bi-chevron-down" />
                  </span>
                </span>
              </a>
              <div className="collapse" id="layouts">
                <ul className="navbar-nav ps-3">
                  <li>
                    <Link to="/new-sale" className="nav-link px-3">
                      <span className="me-2"></span>
                      <span>New Transaction</span>
                    </Link>
                  </li>
                  <li>
                    <Link to="/new-return" className="nav-link px-3">
                      <span className="me-2"></span>
                      <span>New Return</span>
                    </Link>
                  </li>
                  <li>
                    <Link to="/transaction-history" className="nav-link px-3">
                      <span className="me-2"></span>
                      <span>Transaction History</span>
                    </Link>
                  </li>
                  <li>
                    <Link to="/transaction-drafts" className="nav-link px-3">
                      <span className="me-2"></span>
                      <span>Drafts</span>
                    </Link>
                  </li>
                </ul>
              </div>
            </li> */}

            {/* <li>
              <a
                className="nav-link px-3 sidebar-link"
                data-bs-toggle="collapse"
                href="#inventory">
                <span className="me-2">
                  <AiOutlineStock />
                </span>
                <span>Inventory</span>&nbsp;&nbsp;
                <span className="ms-auto">
                  <span className="right-icon">
                    <i className="bi bi-chevron-down" />
                  </span>
                </span>
              </a>
              <div className="collapse" id="inventory">
                <ul className="navbar-nav ps-3">
                  <li>
                    <Link to="/inventory-items" className="nav-link px-3">
                      <span className="me-2"></span>
                      <span>Add Items</span>
                    </Link>
                  </li>
                  <li>
                    <Link to="/inventory-history" className="nav-link px-3">
                      <span className="me-2"></span>
                      <span>History</span>
                    </Link>
                  </li>
                  <li>
                    <Link to="/items-sold" className="nav-link px-3">
                      <span className="me-2"></span>
                      <span>Items Sold</span>
                    </Link>
                  </li>
                  <li>
                    <Link to="/item-traded" className="nav-link px-3">
                      <span className="me-2"></span>
                      <span>Item Traded</span>
                    </Link>
                  </li>
                </ul>
              </div>
            </li> */}

            {/* <li>
              <Link to="/customer" className="nav-link px-3">
                <span className="me-2">
                  <BsPeopleFill />
                </span>
                <span>Customers</span>
              </Link>
            </li> */}


{/* 
            <li>
              <Link to="/price-changes" className="nav-link px-3 ">
                <span className="me-2">
                  <AiFillDollarCircle />
                </span>
                <span>Price Changes</span>
              </Link>
            </li> */}


            <li>
              <a
                className="nav-link px-3 sidebar-link"
                data-bs-toggle="collapse"
                href="#admin">
                <span className="me-2">
                  <RiAdminLine />
                </span>
                <span>Admin</span>&nbsp;&nbsp;
                <span className="ms-auto">
                  <span className="right-icon">
                    <i className="bi bi-chevron-down" />
                  </span>
                </span>
              </a>
              <div className="collapse" id="admin">
                <ul className="navbar-nav ps-3">
                  <li>
                    <Link to="/settings" className="nav-link px-3">
                      <span className="me-2"></span>
                      <span>Settings</span>
                    </Link>
                  </li>
                  <li>
                    <Link to="/finances" className="nav-link px-3">
                      <span className="me-2"></span>
                      <span>Finances</span>
                    </Link>
                  </li>
                  {/* <li>
                    <Link to="/employees" className="nav-link px-3">
                      <span className="me-2"></span>
                      <span>Employees</span>
                    </Link>
                  </li> */}
                  {/* <li>
                    <Link to="/discounts" className="nav-link px-3">
                      <span className="me-2"></span>
                      <span>Discounts</span>
                    </Link>
                  </li> */}
                  <li>
                    <Link to="/stores" className="nav-link px-3">
                      <span className="me-2"></span>
                      <span>Stores</span>
                    </Link>
                  </li>
                  <li>
                    <Link to="/Users" className="nav-link px-3">
                      <span className="me-2"></span>
                      <span>Users</span>
                    </Link>
                  </li>
                </ul>
              </div>
            </li>


          </ul>
        </nav>
      </div>
    </div>
  );
};

export default Sidebar;
