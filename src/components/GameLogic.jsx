import React, { useEffect, useRef, useState } from 'react'
import ResetButton from './ResetButton';
import GameCanvas from './GameCanvas';

function GameLogic({gridProps}) {

    const boardSize = 600;
    const gridCount = Number(gridProps)
    const cellSize = boardSize / gridCount;
    

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
        drawAll();

    }, []);

    useEffect(() => {
        drawAll();
    

       
    }, [table]);

    const handleClick = e => {
    const x = e.nativeEvent.offsetX;
    const y = e.nativeEvent.offsetY;

    let col = Math.floor(x / cellSize);
    let row = Math.floor(y / cellSize);
    

    if (click && row < gridCount && col < gridCount && table[row][col] === '') {
        let input = prompt("กรุณากรอกตัวเลขอะไรก็ได้");
        if (!input ) return;
        input = input.trim();
        
        if (IsSameNumberRow(table, input, row)) {
            alert("เลขนี้มีอยู่แล้วในแถวนี้");
            return;
        }
        if (IsSameNumberCol(table, input, col)) {
            alert("เลขนี้มีอยู่แล้วในคอลลัมน์นี้");
            return;
        }
        const newTable = table.map(r => [...r]);
        newTable[row][col] = input;
        setTable(newTable);
    }
    };

    const IsSameNumberCol = (table,number,row) => {

        let i = 0;
        while(i < gridCount ){
            if (table[row][i] === number){
                return true;
            }
            i++;
        }

        return false;
       
    }

    const IsSameNumberRow = (table,number,col) => {

        let i = 0;
        while(i < gridCount ){
            if (table[i][col] === number){
                return true;
            }
            i++;
        }

        return false;
       
    }


    const drawAll = () => {
        const ctx = ctxRef.current;
        ctx.clearRect(0, 0, 600, 700)
        drawMarks();
        
    }


    const drawMarks = () => {
        const ctx = ctxRef.current;
        ctx.strokeStyle = "#f39899ff";
        ctx.lineWidth = gridCount / gridCount*5;
        for (let row = 0; row < gridCount; row++) {
            for (let col = 0; col < gridCount; col++) {
                const mark = table[row][col];
                if (mark !== '') {
            ctx.beginPath();
            ctx.font = `${cellSize * 0.6}px Arial`;
            ctx.textAlign = "center";
            ctx.textBaseline = "middle";
            ctx.fillStyle = "#f39899";
            ctx.fillText(
                mark,
                col * cellSize + cellSize / 2,
                row * cellSize + cellSize / 2
            );}
            }
        }
    }
    


    

    const resetGame = () => {
        setTable(Array.from({ length: gridCount }, () => Array(gridCount).fill('')));
       
        setClick(true);
    };

    return (<>
        <canvas
            ref={canvasRef}
            width="600"
            height="600"
            style={{ position: "absolute" }}
            onClick={handleClick}
    
        > </canvas>
        <ResetButton onReset={resetGame}/>
        </>
       
        
    )
}

export default GameLogic;
