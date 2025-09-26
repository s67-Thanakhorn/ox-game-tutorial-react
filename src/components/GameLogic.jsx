import React, { useEffect, useRef, useState } from 'react'
import ResetButton from './ResetButton';
import GameCanvas from './GameCanvas';

function GameLogic({ gridProps, turn, setTurn }) {

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

        // เติมค่าไปในช่องบนสุด
        for (let k = 0; k < gridCount; k++) {

            tableArray[0][k] = k + 1

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

        winCheck(table)

        if (winCheck(table)) {
            
            setClick(false)

        } else if (table.flat().every(cell => cell !== '')) {
            alert('You win!');
            setClick(false)

        }

    }, [table]);

    const handleClick = e => {

        const x = e.nativeEvent.offsetX;
        const y = e.nativeEvent.offsetY;

        let col = Math.floor(x / cellSize);
        let row = Math.floor(y / cellSize);

        if (click && row < gridCount && table[row][col] === '') { // ห้ามคลิกเกิน canvas และ ช่องๆนั้นเป็นช่องว่าง 

            const next = table.map(r => r.slice());
            next[row][col] = turn;

            if (winCheck(next)) {

                next[row][col] = '';
                setTable(next);
                return;

            }

            setTable(next);

        }

    };

    const drawAll = () => {
        const ctx = ctxRef.current;
        ctx.clearRect(0, 0, 600, 700)
        drawMarks();

    }


    const drawMarks = () => {
        const ctx = ctxRef.current;

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

    function arraySameCheck(arr) { //check ว่า ทั้ง array นั้นเหมือนกันไหม (ใช้ร่วมกับ isWin())

        for (let i = 0; i < arr.length; i++) {

            for (let j = i + 1; j < arr.length; j++) {

                if (arr[i] === arr[j] && arr.length > 1) {

                    alert(`ห้ามใส่ ${turn} ที่ช่องนี้`);
                    return true; //ถ้าเจอไม่เหมือน return true

                }

            }
        }

        return false;

    }

    const winCheck = (table) => {

        let row = table.length; //3
        const checkBoard = [];

        // แนวนอน
        for (let i = 0; i < row; i++) { // column

            for (let j = 0; j < row; j++) { // row  

                if (table[i][j] !== '') {
                    checkBoard.push(table[i][j]);

                }

            }
            if (arraySameCheck(checkBoard) === true) { //เช็คว่า checkBoard ทั้งarrayเหมือนกันไหม 

                return true;

            }

            checkBoard.length = 0;
        }

        for (let i = 0; i < row; i++) { // column

            for (let j = 0; j < row; j++) { // row  

                if (table[j][i] !== '') {
                    checkBoard.push(table[j][i]);

                }

            }
            if (arraySameCheck(checkBoard) === true) { //เช็คว่า checkBoard ทั้งarrayเหมือนกันไหม 

                return true;

            }

            checkBoard.length = 0;
        }

        return false;

    };

    const resetGame = () => {
        setTable(Array.from({ length: gridCount }, () => Array(gridCount).fill('')));
        setTable(createEmptyTable(gridCount))
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
        <ResetButton onReset={resetGame} />
    </>


    )
}

export default GameLogic;
