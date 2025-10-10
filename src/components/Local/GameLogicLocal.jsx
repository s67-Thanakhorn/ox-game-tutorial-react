import React, { useEffect, useRef, useState } from 'react'
import ResetButton from '../ResetButton';
import GameCanvas from '../GameCanvas';
import ShowText from '../ShowText';

function GameLogic({ gridProps , turn , setTurn}) {

    const boardSize = 600;
    const gridCount = Number(gridProps)
    const cellSize = boardSize / gridCount;

    // สร้าง array 2D ขนาด n*n
    const createEmptyTable = (gridCount) => {
        const tableArray = [];
        let i = 0;

        while (i < gridCount) {
            const row = [];
            let j = 0;

            while (j < gridCount) {
                row.push('');
                j++;
            }

            tableArray.push(row);
            i++;
        }
        return tableArray;
    };

    // ใช้กับ useState
    
    const [table, setTable] = useState(createEmptyTable(gridCount));

    const canvasRef = useRef(null);
    const ctxRef = useRef(null);
    const [click, setClick] = useState(true);

    useEffect(() => {

        const c = canvasRef.current;
        const ctx = c.getContext("2d");
        ctxRef.current = ctx;
        setTurn(1)
        drawMarks();

    }, []);

    useEffect(() => {

        drawMarks();

    }, [table]);

    const handleClick = e => {
        const x = e.nativeEvent.offsetX;
        const y = e.nativeEvent.offsetY;

        let col = Math.floor(x / cellSize);
        let row = Math.floor(y / cellSize);

        if(find(turn,row,col)){

            alert(`แถวนี้เลข ${turn} ซ้ำ!`)
            return;
        }

        if (click && row < gridCount && table[row][col] === '') {
            const newTable = table.map(r => [...r]);
            newTable[row][col] = turn;
            setTable(newTable);
        }
    };

    const drawMarks = () => {
        const ctx = ctxRef.current;
        ctx.clearRect(0, 0, 600, 700)
        // ฟอนต์สเกลตาม cellSize
        const fontPx = Math.floor(cellSize * 0.4);
        ctx.font = `${fontPx}px Arial`;

        for (let i = 0; i < gridCount; i++) {

            for (let j = 0; j < gridCount; j++) {

                const cx = j * cellSize + cellSize / 2.8; // ศูนย์กลางแกน X ของช่อง 
                const cy = i * cellSize + cellSize / 1.5; // ศูนย์กลางแกน Y ของช่อง 

                ctx.fillText(table[i][j], cx, cy);

            }

        }

    }

    const find = (x,r,c) => {

        //เช็คแนวนอน

        for(let i = 0 ; i < table.length ; i++){

            if(table[r][i] === x){

                return true
            }

        }

        //เช็คแนวตั้ง

        for(let i = 0 ; i < table.length ; i++){

            if(table[i][c] === x){

                return true

            }

        }

        return false

    };

    const resetGame = () => {
        setTable(Array.from({ length: gridCount }, () => Array(gridCount).fill('')));

        setClick(true);
    };

    return (<>
        
        <form style={{position : 'relative', bottom : 30}} >

            <input type="number" 
            placeholder='Enter number'
            value={turn}
            onChange={(e)=>{setTurn(e.target.value)}}
            
            />

        </form>

        <canvas
        ref={canvasRef}
        width="600vh"
        height="600vh"
        style={{ position: "absolute"  }}
        onClick={handleClick}
      />
        <ResetButton onReset={resetGame} />
    </>


    )
}

export default GameLogic;
