// import { useState, useEffect } from 'react'
// import reactLogo from './assets/react.svg'
// import viteLogo from '/vite.svg'
// import GameCanvas from "./components/GameCanvas";
// import GameLogic from './components/GameLogic';
import './App.css'
// import GridInput from './components/GridInput';
import PossibleNum from './components/PossibleNum';
import SudokuBoard from './components/SudokuBoard';

function App() {

  
  return (
    <>

      {/* <GameCanvas gridProps={grid} />
      <GameLogic gridProps={grid} />
      <GridInput grid={grid} setGrid={setGrid} /> */}
  
      <SudokuBoard/>

    </>
  )
}

export default App
