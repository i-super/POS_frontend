import React, { useContext, useEffect } from "react";
import "./Navbar.css";
import logo from "../../assets/images/logo.png";
import { Link } from "react-router-dom";
import Select from "react-select";
import { StoreContext } from "../StoreContext";
import { api } from "../../Services/api-service";
import authSvc from "../../Services/auth-service";
import { filter, skip } from "rxjs";

const Navbar = () => {
  const { stores, selectedStore, setSelectedStore, setStores } = useContext(StoreContext);

  const storeOptions = stores.map((store) => ({
    ...store,
    value: store.id,
    label: store.storeName,
  }));

  useEffect(() => {
    fetchStores();
  }, [])

  const fetchStores = async () => {
    const response = await api.get("get-store");

    if (response && response.status === 200) {
      setStores(response.data.data);
      if (!selectedStore) {
        setSelectedStore({
          ...response.data.data[0],
          value: response.data.data[0].id,
          label: response.data.data[0].storeName,
        })
      }
    }
  };

  useEffect(() => {
    const subscription = authSvc.loginObservable$
      .pipe(
        skip(1),
        filter((isLoggedIn) => !isLoggedIn)
      )
      .subscribe(() => {
        localStorage.clear();
        window.location.reload()
      });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const handleStoreChange = (selectedOption) => {
    setSelectedStore(selectedOption);
    localStorage.setItem("selectedStore", JSON.stringify(selectedOption));
  };

  return (
    <nav className="navbar navbar-expand-lg bg-body-tertiary pos-navbar">
      <div className="container-fluid">
        <a
          className="navbar-brand"
          href="#"
          style={{
            fontFamily: "Josefin-bold",
            color: "#ffff",
            fontSize: "30px",
          }}>
          POS
        </a>
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarText"
          aria-controls="navbarText"
          aria-expanded="false"
          aria-label="Toggle navigation">
          <span className="navbar-toggler-icon" />
        </button>
        <div className="collapse navbar-collapse" id="navbarText">
          <ul className="navbar-nav me-auto mb-2 mb-lg-0">
            <li className="nav-item">
              <Link to="/" className="nav-link px-3">
                <span>Dashboard</span>
              </Link>
            </li>

            <li className="nav-item dropdown">
              <a
                className="nav-link dropdown-toggle"
                href="#"
                role="button"
                data-bs-toggle="dropdown"
                aria-expanded="false">
                Transaction
              </a>
              <ul className="dropdown-menu">
                <li>
                  <Link to="/new-sale" className="dropdown-item">
                    <span>New Sale</span>
                  </Link>
                </li>
                <li>
                  <Link to="/new-Trade" className="dropdown-item">
                    <span>New Trade</span>
                  </Link>
                </li>
                <li>
                  <Link to="/new-return" className="dropdown-item">
                    <span>New Return</span>
                  </Link>
                </li>
                <li>
                  <Link to="/transaction-history" className="dropdown-item">
                    <span>Transaction History</span>
                  </Link>
                </li>
                <li>
                  <Link to="/transaction-drafts" className="dropdown-item">
                    <span>Drafts</span>
                  </Link>
                </li>
              </ul>
            </li>

            <li className="nav-item dropdown">
              <a
                className="nav-link dropdown-toggle"
                href="#"
                role="button"
                data-bs-toggle="dropdown"
                aria-expanded="false">
                Inventory
              </a>
              <ul className="dropdown-menu">
                <li>
                  <Link to="/inventory-items" className="dropdown-item">
                    <span>Items</span>
                  </Link>
                </li>
                <li>
                  <Link to="/inventory-history" className="dropdown-item">
                    <span>History</span>
                  </Link>
                </li>
                <li>
                  <Link to="/inventory-summary" className="dropdown-item">
                    <span>Summary</span>
                  </Link>
                </li>
                {/* <li>
                  <Link to="/items-sold" className="dropdown-item">
                    <span>Items Sold</span>
                  </Link>
                </li>
                <li>
                  <Link to="/item-traded" className="dropdown-item">
                    <span>Item Traded</span>
                  </Link>
                </li> */}
              </ul>
            </li>

            <li className="nav-item">
              <Link to="/customer" className="nav-link">
                <span>Customers</span>
              </Link>
            </li>

            <li className="nav-item">
              <Link to="/price-changes" className="nav-link">
                <span>Price Changes</span>
              </Link>
            </li>

            <li className="nav-item">
              <Link to="/categories" className="nav-link">
                <span>Categories</span>
              </Link>
            </li>

            <li className="nav-item dropdown">
              <a
                className="nav-link dropdown-toggle"
                href="#"
                role="button"
                data-bs-toggle="dropdown"
                aria-expanded="false">
                Admin
              </a>
              <ul className="dropdown-menu">
                {/* <li>
                  <Link to="/settings" className="dropdown-item">
                    <span>Settings</span>
                  </Link>
                </li> */}
                <li>
                  <Link to="/finances" className="dropdown-item">
                    <span>Finances</span>
                  </Link>
                </li>
                <li>
                  <Link to="/stores" className="dropdown-item">
                    <span>Stores</span>
                  </Link>
                </li>
                <li>
                  <Link to="/Users" className="dropdown-item">
                    <span>Users</span>
                  </Link>
                </li>
              </ul>
            </li>
            <li className="nav-item">
              <Select
                options={storeOptions}
                value={selectedStore}
                onChange={handleStoreChange}
                placeholder="Select Store"
              />
            </li>
          </ul>
          <span className="navbar-text">
            <div className="collapse navbar-collapse" id="topNavBar">
              <ul className="navbar-nav ms-auto">
                <li className="nav-item dropdown">
                  <a
                    className="nav-link dropdown-toggle ms-2"
                    href="#"
                    role="button"
                    data-bs-toggle="dropdown"
                    aria-expanded="false">
                    <i className="bi bi-person-fill" />
                  </a>
                  <ul className="dropdown-menu dropdown-menu-end">
                    <li>
                      <Link
                        className="dropdown-item"
                        onClick={() => {
                          localStorage.clear();
                          window.location.reload();
                        }}>
                        Log out
                      </Link>
                    </li>
                  </ul>
                </li>
              </ul>
            </div>
          </span>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
