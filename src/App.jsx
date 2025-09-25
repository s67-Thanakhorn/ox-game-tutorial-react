import { useState, useEffect } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import GameCanvas from "./components/GameCanvas";
import GameLogic from './components/GameLogic';
import './App.css'
import GridInput from './components/GridInput';
import TurnShow from './components/TurnShow';
import NumberInput from './components/NumberInput';

function App() {

  const [grid, setGrid] = useState(() => {
    const saved = localStorage.getItem("grid");
    const n = Number(saved);
    return Number.isInteger(n) && n >= 3 ? n : 3; // ค่าเริ่มต้น
  });

  useEffect(() => {
    localStorage.setItem("grid", String(grid));
  }, [grid]);

  const [turn, setTurn] = useState(1);

  return (
    <>

      <TurnShow turn={turn}/>
      <NumberInput setTurn = {setTurn} turn={turn}/>
      <GameCanvas gridProps={grid} />
      <GameLogic gridProps={grid} turn={turn} setTurn={setTurn}/>
      <GridInput grid={grid} setGrid={setGrid} />

    </>
  )
}

export default App
