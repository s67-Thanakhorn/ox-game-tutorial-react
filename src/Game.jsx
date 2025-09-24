import { useState, useEffect } from 'react'

import GameCanvas from "./components/GameCanvas";
import GameLogic from './components/GameLogic';
import './App.css'
import GridInput from './components/GridInput';

function Game() {

    const [grid, setGrid] = useState(() => {
        const saved = localStorage.getItem("grid");
        const n = Number(saved);
        return Number.isInteger(n) && n >= 3 ? n : 3; // ค่าเริ่มต้น
    });

    useEffect(() => {
        localStorage.setItem("grid", String(grid));
    }, [grid]);

    return (
        <>

            <GameCanvas gridProps={grid} />
            <GameLogic gridProps={grid} />
            <GridInput grid={grid} setGrid={setGrid} />

        </>
    )
}

export default Game