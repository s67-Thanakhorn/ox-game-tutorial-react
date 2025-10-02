import { useState, useEffect } from 'react';

import GameCanvas from "./components/GameCanvas";
import GameLogicOnline from './components/Online/GameLogicOnline';
import GameLogicLocal from './components/Local/GameLogicLocal';
import './App.css';
import GridInput from './components/GridInput';
import ShowText from './components/ShowText';

export default function Game({ scene, setScene }) {
  const [grid, setGrid] = useState(() => {
    const saved = localStorage.getItem("grid");
    const n = Number(saved);
    return Number.isInteger(n) && n >= 3 ? n : 3; // ค่าเริ่มต้น
  });

  useEffect(() => {
    localStorage.setItem("grid", String(grid));
  }, [grid]);

  const [turn, setTurn] = useState('O');

  // ปุ่มออกจากห้อง → ล้างค่า แล้วกลับเมนู
  const leaveRoom = () => {
    localStorage.removeItem('scene1');
    localStorage.removeItem('roomId');
    localStorage.removeItem('symbol');     // ถ้ามีใช้
    localStorage.removeItem('join_only');  // ถ้ามีใช้
    setScene(''); // กลับเมนู
  };

  return (
    <>
      <div style={{ display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center', width: 620, margin: '8px 0' }}>
        <ShowText turn={turn} />
        {scene === 'Onlineplayer' && (
          <button onClick={leaveRoom} style={{ padding: '6px 10px', zIndex: 1000 }}>
            ออกจากห้อง
          </button>
        )}
      </div>


      <GameCanvas gridProps={grid} />
      {scene === 'Onlineplayer' ? (
        <GameLogicOnline gridProps={grid} turn={turn} setTurn={setTurn} />
      ) : null}
      {scene === 'Singleplayer' ? (
        <GameLogicLocal gridProps={grid} turn={turn} setTurn={setTurn} />
      ) : null}

      <GridInput grid={grid} setGrid={setGrid} />
    </>
  );
} 