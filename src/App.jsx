import './App.css'
import { useState , useEffect } from 'react'
import Game from './Game'
import Menu from './components/Menu'

function App() {

  const [scene1, setScene1] = useState(() => {
    const saved = localStorage.getItem('scene1');
    if (saved) return saved;
    return localStorage.getItem('roomId') ? 'Onlineplayer' : '';
  });

  //  เวลา scene เปลี่ยน ให้บันทึกไว้
  useEffect(() => {
    localStorage.setItem('scene1', scene1);
  }, [scene1]);
  return (
    <>
  
      {scene1 === '' ? <Menu setScene={setScene1}/> : null}
      {scene1 ? <Game scene={scene1} setScene={setScene1} /> : null}

      
    </>
  )
}

export default App
