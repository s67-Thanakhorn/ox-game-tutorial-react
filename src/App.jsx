import { useState, useEffect } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import GameCanvas from "./components/GameCanvas";
import GameLogic from './components/GameLogic';
import './App.css'
import GridInput from './components/GridInput';
import TurnShow from './components/TurnShow';

function App() {

  const [turn, setTurn] = useState('☐');

  const [grid, setGrid] = useState(() => {
    const saved = localStorage.getItem("grid");
    const n = Number(saved);
    return Number.isInteger(n) && n >= 2 ? n : 2; // ค่าเริ่มต้น
  });

  useEffect(() => {
    localStorage.setItem("grid", String(grid));
  }, [grid]);

  return (
    <>
      <TurnShow turn={turn}/>
      <GameCanvas gridProps={grid} />
      <GameLogic gridProps={grid} turn={turn} setTurn={setTurn}/>
      <GridInput grid={grid} setGrid={setGrid} />

    </>
  )
}

export default App
