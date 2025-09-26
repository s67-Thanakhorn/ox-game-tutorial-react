import { useState, useEffect } from 'react'

import GameCanvas from "./components/GameCanvas";
import GameLogicOnline from './components/Online/GameLogicOnline';
import GameLogicLocal from './components/Local/GameLogicLocal';
import './App.css'
import GridInput from './components/GridInput';
import ShowText from './components/ShowText';
function Game({scene    }) {

    
    const [grid, setGrid] = useState(() => {
        const saved = localStorage.getItem("grid");
        const n = Number(saved);
        return Number.isInteger(n) && n >= 3 ? n : 3; // ค่าเริ่มต้น
    });

    useEffect(() => {
        localStorage.setItem("grid", String(grid));
    }, [grid]);

    const [turn, setTurn] = useState('O');

    return (
        <>
            <ShowText turn={turn}/>
            <GameCanvas gridProps={grid} />

            {scene === 'Onlineplayer' ? <GameLogicOnline gridProps={grid} turn={turn} setTurn={setTurn} /> : null}
            {scene === 'Singleplayer' ? <GameLogicLocal gridProps={grid} turn={turn} setTurn={setTurn} /> : null}

            <GridInput grid={grid} setGrid={setGrid} />

        </>
    )
}

export default Game