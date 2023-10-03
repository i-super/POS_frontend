import React from "react";
import { TailSpin } from "react-loader-spinner";

const LoaderSpinner = () => {
  return (
    <>
      <div style={styles.overlay}></div>
      <div style={styles.loader}>
        <TailSpin type="TailSpin" color="#0EC4CB" height={100} width={100} />
      </div>
    </>
  );
};

export default LoaderSpinner;

const styles = {
  loader: {
    position: "absolute",
    top: "50%",
    left: "50%",
    marginTop: "-50px",
    marginLeft: "-50px",
    zIndex: 999999,
  },
  overlay: {
    background: "#000",
    height: "100%",
    opacity: 0.6,
    position: "fixed",
    width: "100%",
    zIndex: 999998,
  },
};
