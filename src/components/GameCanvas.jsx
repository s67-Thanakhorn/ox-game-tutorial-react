import { useEffect } from "react";

function GameCanvas() {
  useEffect(() => {
    const c = document.getElementById("myCanvas");
    const ctx = c.getContext("2d");

    const boardSize = 600;
    const gridCount = 3
    const cellSize = boardSize / gridCount;

    function drawGrid() {
      ctx.strokeStyle = "pink"; 
      ctx.lineWidth = 5;
      ctx.beginPath();
      //แนวตั้ง
      for (let i = 1; i < gridCount; i++) {
        ctx.moveTo(cellSize * i, 0);
        ctx.lineTo(cellSize * i, boardSize);
      }
      //แนวนอน
      for (let i = 1; i < gridCount; i++) {
        ctx.moveTo(0, cellSize * i);
        ctx.lineTo(boardSize, cellSize * i);
      }

      ctx.stroke();
    }

    drawGrid();
  }, []);

  return (
    <canvas
      id="myCanvas"
      width="600"
      height="600"
      style={{ border: "5px solid pink" }}
    ></canvas>
  );
}

export default GameCanvas;
