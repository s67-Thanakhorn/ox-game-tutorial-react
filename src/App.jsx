import './App.css'
import { useState , useEffect } from 'react'
import Game from './Game'
import Menu from './components/Menu'

function App() {

  // ตัวแปรไว้ set state ของ components
  const [ scene1 , setScene1] = useState(false)

  return (
    <>
  
      {scene1 === false ? <Menu setScene={setScene1}/> : null}
      {scene1 ? <Game/> : null }
      
    </>
  )
}

export default App
