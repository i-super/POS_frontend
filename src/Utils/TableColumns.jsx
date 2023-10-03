import { AiFillDelete, AiOutlineEdit } from "react-icons/ai";
import { LEFT_ALIGN, LEFT_ALIGN_WITH_BORDER } from "./Util";

export const storeColumns = [
  {
    id: "Name",
    name: "Name",
    selector: (row) => row.name,
    sortable: true,
    style: LEFT_ALIGN_WITH_BORDER,
  },

  {
    id: "Sales",
    name: "Sales",
    selector: (row) => Number(row.sales).toFixed(2),
    sortable: true,
    style: LEFT_ALIGN,
  },
  {
    id: "Returns",
    name: "Returns",
    selector: (row) => Number(row.returns).toFixed(2),
    sortable: true,
    style: LEFT_ALIGN,
  },
  {
    id: "Trades",
    name: "Trades",
    selector: (row) => Number(row.trades).toFixed(2),
    sortable: true,
    style: LEFT_ALIGN,
  },
  {
    id: "COGS",
    name: "COGS",
    selector: (row) => Number(row.cogs).toFixed(2),
    sortable: true,
    style: LEFT_ALIGN,
  },
  {
    id: "Gross Profit",
    name: "Gross Profit",
    selector: (row) => Number(row.sales - row.cogs - row.returns).toFixed(2),
    sortable: true,
    style: LEFT_ALIGN,
  },
];
