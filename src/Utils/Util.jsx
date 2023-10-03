export const datatableStyle = {
  // rows: {
  //   style: {
  //     minHeight: "36px",
  //     borderBottom: "0px !important",
  //   },
  // },
  // headRow: {
  //   style: {
  //     minHeight: "36px",
  //     backgroundColor: "#d4c088cf",
  //     borderTop: "0.5pt solid #ccc !important",
  //     borderBottom: "none !important",
  //   },
  //   denseStyle: {
  //     minHeight: "24px",
  //   },
  // },
  // headCells: {
  //   style: {
  //     fontSize: "14px",
  //     border: "0.5pt solid #ccc !important",
  //     borderTop: "none !important",
  //     borderRight: "none !important",
  //     paddingLeft: "8px",
  //     paddingRight: "8px",
  //   },
  // },

  // cells: {
  //   style: {
  //     minHeight: "30px",
  //     fontSize: "14px",
  //     border: "0.5pt solid #d7d8e1 !important",
  //     borderTop: "none !important",
  //     borderRight: "none !important",
  //     paddingLeft: "8px",
  //     // paddingRight: "8px !important",
  //   },
  //   denseStyle: {
  //     minHeight: "30px",
  //   },
  // },

  rows: {
    style: {
      minHeight: "36px",
    },
  },
  headRow: {
    style: {
      minHeight: "36px",
      backgroundColor: "#EBEBEB",
      borderBottom: "none !important",
      width:"100% !important"
    },
    denseStyle: {
      minHeight: "24px",
    },
  },
  headCells: {
    style: {
      fontSize: "14px",
      color: "#62606E",
      borderTopLeftRadius: "15px !important",
      fontFamily: "Josefin-medium",
      borderTop: "none !important",
      borderRight: "none !important",
      padding: "13px",
    },
  },

  cells: {
    style: {
      minHeight: "30px",
      fontSize: "14px",
      borderBottom: "0.5pt solid #d7d8e1 !important",
      borderTop: "none !important",
      borderRight: "none !important",
      padding: "15px",
    },
    denseStyle: {
      minHeight: "30px",
    },
  },
};

export const paginationStyle = {
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
    backgroundColor: "#DEF4FC",
    border: "1px solid #DEF4FC",
  },
  inactive: {
    backgroundColor: "#FFFFFF",
  },
  hoverColor: "#DEF4FC",
};

export const LEFT_ALIGN = {
  paddingLeft: "8px",
  paddingRight: "25px",
  // borderLeft: "0.5pt solid #d7d8e1 !important",
};

export const RIGHT_ALIGN = {
  display: "flex",
  alignItems: "right",
  justifyContent: "right",
};

export const LEFT_ALIGN_WITH_BORDER = {
  ...LEFT_ALIGN,
  borderLeft: "0.5pt solid #d7d8e1 !important",
};
