import React, { createContext, useEffect, useState } from "react";

export const StoreContext = createContext();

export const StoreProvider = ({ children }) => {
  const [stores, setStores] = useState([]);
  const [selectedStore, setSelectedStore] = useState(() => {
    const storedValue = localStorage.getItem("selectedStore");
    return storedValue ? JSON.parse(storedValue) : null;
  });

  useEffect(() => {
    if (selectedStore) {
      localStorage.setItem("selectedStore", JSON.stringify(selectedStore));
    } else {
      localStorage.removeItem("selectedStore");
    }
  }, [selectedStore]);

  return (
    <StoreContext.Provider value={{ stores, selectedStore, setSelectedStore, setStores }}>
      {children}
    </StoreContext.Provider>
  );
};
