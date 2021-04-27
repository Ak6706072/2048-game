import React from "react";
import "./style.css";

function GridCell({ value }) {
  return (
    <div className={`gridcell ${value !== 0 && "bkcolor"}`}>
      {value !== 0 && value}
    </div>
  );
}

export default GridCell;
