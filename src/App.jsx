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

  // สำหรับบอกว่าเป็น player 1 หรือ player 2 (คนสร้างหรือคนเข้า)
  const [player1 , setPlayer1] = useState(false);
  const [player2 , setPlayer2] = useState(false);

  return (
    <>
  
      {scene1 === '' ? <Menu setScene={setScene1} setPlayer1={setPlayer1} setPlayer2={setPlayer2}/> : null}
      {scene1 ? <Game scene={scene1} setScene={setScene1} player1={player1} player2={player2}/> : null}

      
    </>
  )
}

export default App
