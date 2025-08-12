import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import GameCanvas from "./components/GameCanvas";
import GameLogic from './components/GameLogic';
import './App.css'

function App() {
  
  return (
    <>
      
      <GameCanvas />
      <GameLogic /> 

    </>
  )
}

export default App
