import React from "react";
import GridCell from "./GridCell";
import crypto from "crypto";
import "./style.css";

function GridRow({ row, grid, setGrid, rowIndex }) {
  return (
    <div className="row">
      {row.map((value, colIndex) => {
        return (
          <GridCell
            value={value}
            grid={grid}
            setGrid={setGrid}
            value={grid[rowIndex][colIndex]}
            key={crypto.randomBytes(10).toString("hex")}
          />
        );
      })}
    </div>
  );
}

export default GridRow;
