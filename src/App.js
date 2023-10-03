import "bootstrap/dist/css/bootstrap.css";
import "bootstrap/dist/js/bootstrap.bundle";

import { Route, Routes, Navigate, useNavigate } from "react-router-dom";
import Navbar from "./Components/Navbar/Navbar";
import Sidebar from "./Components/Sidebar/Sidebar";
import Dashboard from "./Pages/Dashboard/Dashboard";
import History from "./Pages/Transactions/History/History";
import NewTransactions from "./Pages/Transactions/Trade/NewTrade";
import Customer from "./Pages/Customers/Customer";
import NewSale from "./Pages/Transactions/NewSale/NewSale";
import NewReturn from "./Pages/Transactions/NewReturn/NewReturn";
import Drafts from "./Pages/Transactions/Drafts/Drafts";
import Items from "./Pages/Inventory/Items/Items";
import InventoryHistory from "./Pages/Inventory/History/History";
import ItemSold from "./Pages/Inventory/ItemSold/ItemSold";
import ItemTraded from "./Pages/Inventory/ItemTraded/ItemTraded";
import AddCustomer from "./Pages/Customers/AddCustomer/AddCustomer";
import PriceChanges from "./Pages/PriceChanges/PriceChanges";
import EditPrice from "./Pages/PriceChanges/EditPrice/EditPrice";
import Finances from "./Pages/Admin/Finances/Finances";
import Discounts from "./Pages/Admin/Discounts/Discounts";
import Stores from "./Pages/Admin/Stores/Stores";
import Employees from "./Pages/Admin/Employees/Employees";
import Settings from "./Pages/Admin/Settings/Settings";
import ShowEmployees from "./Pages/Admin/Employees/ShowEmployees/ShowEmployees";
import ShowStore from "./Pages/Admin/Stores/ShowStore/ShowStore";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import InventoryOptions from "./Pages/Inventory/InventoryOptions/InventoryOptions";
import Login from "./Pages/Login/Login";
import { useEffect, useState } from "react";
import Users from "./Pages/Admin/Users/Users";
import ShowUsers from "./Pages/Admin/Users/ShowUsers";
import LoaderSpinner from "./Components/Loader";
import spinnerSvc from "./Services/spinner";
import NewTrade from "./Pages/Transactions/Trade/NewTrade";
import EditInventory from "./Pages/Inventory/EditInventory/EditInventory";
import Categories from "./Pages/Categories/Categories";
import { StoreProvider } from "./Components/StoreContext";
import Summary from "./Pages/Inventory/History/Summary";
function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();
  const currentRoute = window.location.pathname;

  const validateLoggedInStatus = async () => {
    const token = localStorage.getItem("idToken");
    if (token) {
      setIsLoggedIn(true);
      navigate({ currentRoute });
    } else {
      setIsLoggedIn(false);
    }
  };

  useEffect(() => {
    validateLoggedInStatus();
  }, []);

  useEffect(() => {
    const subscription = spinnerSvc.requestInProgress.subscribe((isLoading) =>
      setIsLoading(isLoading)
    );

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  return (
    <StoreProvider>
      <div className="App">
        <ToastContainer hideProgressBar={true} />
        {isLoading && <LoaderSpinner />}
        {isLoggedIn ? (
          <>
            <Navbar />
            {/* <Sidebar /> */}
            <Routes>
              <Route path="/" element={<Navigate to={"/Dashboard"} />} />
              <Route path="/Dashboard" element={<Dashboard />} />
              <Route path="/new-transaction" element={<NewTransactions />} />
              <Route path="/transaction-history" element={<History />} />
              <Route path="/customer" element={<Customer />} />
              <Route path="/new-sale" element={<NewSale />} />
              <Route path="/new-sale/:id" element={<NewSale />} />
              <Route path="/categories" element={<Categories />} />
              <Route path="/new-trade" element={<NewTrade />} />
              <Route path="/new-return" element={<NewReturn />} />
              <Route path="/transaction-drafts" element={<Drafts />} />
              <Route path="/inventory-items" element={<Items />} />
              <Route path="/inventory-summary" element={<Summary />} />
              <Route
                path="/inventory-options/:id"
                element={<InventoryOptions />}
              />

              <Route path="/edit-inventory/:id" element={<EditInventory />} />

              <Route path="/inventory-history" element={<InventoryHistory />} />
              <Route path="/items-sold" element={<ItemSold />} />
              <Route path="/item-traded" element={<ItemTraded />} />
              <Route path="/add-customer" element={<AddCustomer />} />
              <Route path="/edit-customer/:id" element={<AddCustomer />} />
              <Route path="/price-changes" element={<PriceChanges />} />
              <Route path="/edit-price" element={<EditPrice />} />
              <Route path="/finances" element={<Finances />} />
              <Route path="/discounts" element={<Discounts />} />
              <Route path="/employees" element={<ShowEmployees />} />
              <Route path="/stores" element={<ShowStore />} />
              <Route path="/add-stores" element={<Stores />} />
              <Route path="/edit-stores/:id" element={<Stores />} />
              <Route path="/settings" element={<Settings />} />
              <Route path="/add-employee" element={<Employees />} />
              <Route path="/add-employee/:id" element={<Employees />} />
              <Route path="/users" element={<ShowUsers />} />
              <Route path="/add-user" element={<Users />} />
              <Route path="/edit-user/:id" element={<Users />} />
            </Routes>
          </>
        ) : (
          <>
            <Routes>
              <Route path="/" element={<Navigate to={"/login"} />} />
              <Route
                path="/login"
                element={<Login onLogin={() => setIsLoggedIn(true)} />}
              />
              <Route path="*" element={<Navigate to={"/login"} />} />
            </Routes>
          </>
        )}
      </div>
    </StoreProvider>
  );
}

export default App;
