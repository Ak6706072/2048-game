import React, { useEffect, useState } from "react";
import GridRow from "../GridRow";
import crypto from "crypto";
import "./style.css";

const initGrid = [...Array(4)].map((_) => new Array(4).fill(0));
initGrid[2][2] = 2;
initGrid[3][3] = 4;
function Board() {
  //initializing th grid box 4X4
  const [grid, setGrid] = useState(initGrid);
  const [score, setScore] = useState(0);
  const [gameActive, setGameActive] = useState(true);
  const [winner, setWinner] = useState(false);

  const addNewNumber = (board) => {
    let blankSpaces = [];
    const n = board.length;
    //get all the blank cell where we can generate 2,4
    for (let i = 0; i < n; i++) {
      for (let j = 0; j < n; j++) {
        if (board[i][j] === 0) {
          blankSpaces.push({ row: i, col: j });
        }
      }
    }
    // console.log(blankSpaces);
    //take random postion in the grid
    let position = Math.floor(Math.random() * blankSpaces.length);
    board[blankSpaces[position].row][blankSpaces[position].col] =
      Math.random() > 0.5 ? 2 : 4;
    // console.table(board);
    setGrid(board);
  };
  const shift = (direction, row) => {
    //[0,2,4,0,4,0]
    //[0,0,0 2,4,4] right shifting
    //[2,4,4,0,0,0]  left shifting
    const nonZeros = row.filter((elem) => elem);
    const zeros = row.length - nonZeros.length;
    const zerosArr = [...new Array(zeros).fill(0)];
    let arr;
    switch (direction) {
      case "left": {
        arr = [...nonZeros, ...zerosArr];
        console.log("row", arr);
        return arr;
      }
      case "right": {
        arr = [...zerosArr, ...nonZeros];
        return arr;
      }
    }
  };
  const mergeRight = (row) => {
    let playerScore = 0;
    for (let i = row.length - 1; i > 0; i--) {
      let curr = row[i];
      let prev = row[i - 1];
      if (curr === prev) {
        row[i] = curr + prev;
        playerScore += row[i];
        row[i - 1] = 0;
      }
    }
    setScore((prevScore) => prevScore + playerScore);
  };
  const mergeLeft = (row) => {
    let playerScore = 0;
    for (let i = 0; i < row.length - 1; i++) {
      let curr = row[i];
      let prev = row[i + 1];
      if (curr === prev) {
        row[i] = curr + prev;
        playerScore += row[i];
        row[i + 1] = 0;
      }
    }
    setScore((prevScore) => prevScore + playerScore);
    // console.log(row);
  };
  const transposeOfMatrix = (matrix) => {
    const n = matrix.length;
    let temp;
    for (let i = 0; i < n; i++) {
      for (let j = 0; j < n; j++) {
        if (j > i) {
          temp = matrix[i][j];
          matrix[i][j] = matrix[j][i];
          matrix[j][i] = temp;
        }
      }
    }
  };
  const upShift = () => {
    let copyGrid = [...grid];
    transposeOfMatrix(copyGrid);
    copyGrid = copyGrid.map((row) => {
      let copyRow = [...row];
      //shifting the row
      copyRow = shift("left", [...copyRow]);
      //merging the row
      mergeLeft(copyRow);
      //[2,2,0,2,2]
      //again shifting row
      copyRow = shift("left", [...copyRow]);
      return copyRow;
    });
    transposeOfMatrix(copyGrid);
    addNewNumber(copyGrid);
  };
  const downShift = () => {
    let copyGrid = [...grid];
    transposeOfMatrix(copyGrid);
    copyGrid = copyGrid.map((row) => {
      let copyRow = [...row];
      //shifting the row
      copyRow = shift("right", [...copyRow]);
      //merging the row
      mergeLeft(copyRow);
      //[2,2,0,2,2]
      //again shifting row
      copyRow = shift("right", [...copyRow]);
      return copyRow;
    });
    transposeOfMatrix(copyGrid);
    addNewNumber(copyGrid);
  };

  const leftShift = () => {
    let copyGrid = [...grid];
    copyGrid = copyGrid.map((row) => {
      let copyRow = [...row];
      //shifting the row
      copyRow = shift("left", [...copyRow]);
      //merging the row
      mergeLeft(copyRow);
      //[2,2,0,2,2]
      //again shifting row
      copyRow = shift("left", [...copyRow]);
      return copyRow;
    });

    addNewNumber(copyGrid);
  };

  const rightShift = () => {
    let copyGrid = [...grid];
    copyGrid = copyGrid.map((row) => {
      let copyRow = [...row];
      //shifting the row
      copyRow = shift("right", [...copyRow]);
      //merging the row
      mergeRight(copyRow);
      //[2,2,0,2,2]
      //again shifting row
      copyRow = shift("right", [...copyRow]);
      return copyRow;
    });
    addNewNumber(copyGrid);
  };
  const isGameActive = () => {
    const active = grid.some((row) => row.some((elem) => elem === 0));
    if (!active) {
      return false;
    } else {
      return true;
    }
  };
  const winCondition = () => {
    const n = grid.length;
    for (let i = 0; i < n; i++) {
      for (let j = 0; j < n; j++) {
        if (grid[i][j] >= 28) {
          return true;
        }
      }
    }
    return false;
  };

  const gameInstruction = (e) => {
    if (!isGameActive()) {
      setGameActive(false);
      return;
    }
    if (winCondition()) {
      setWinner(true);
      return;
    }
    const { code } = e;
    switch (code) {
      case "ArrowLeft": {
        console.log("key left");
        leftShift();
        return;
      }
      case "ArrowRight": {
        console.log("key right");
        rightShift();
        return;
      }
      case "ArrowUp": {
        console.log("key up");
        upShift();
        return;
      }
      case "ArrowDown": {
        console.log("key down");
        downShift();
        return;
      }
    }
  };

  useEffect(() => {
    window.addEventListener("keydown", gameInstruction);
    return () => {
      window.removeEventListener("keydown", gameInstruction);
    };
  }, [grid]);

  if (!gameActive) {
    return (
      <>
        <h1> !!!Lost the Game!!! </h1>
        <h3>Final Score: {score}</h3>
      </>
    );
  }

  if (winner) {
    return (
      <>
        <h1> !!!Won the Game!!! </h1>
        <h3>Final Score: {score}</h3>
      </>
    );
  }
  return (
    <>
      <h3>Score: {score}</h3>
      <div className="board">
        {grid.map((row, index) => {
          return (
            <GridRow
              row={row}
              grid={grid}
              setGrid={setGrid}
              rowIndex={index}
              key={crypto.randomBytes(10).toString("hex")}
            />
          );
        })}
      </div>
    </>
  );
}

export default Board;
