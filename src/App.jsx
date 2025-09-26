import './App.css'
import { useState , useEffect } from 'react'
import Game from './Game'
import Menu from './components/Menu'

function App() {

  // ตัวแปรไว้ set state ของ components
  const [ scene1 , setScene1] = useState('')

  return (
    <>
  
      {scene1 === '' ? <Menu setScene={setScene1}/> : null}
      {scene1 ? <Game scene = {scene1}/> : null }

      
    </>
  )
}

export default App
