import React, { useEffect, useRef, useState } from 'react'
import ResetButton from './ResetButton';
import GameCanvas from './GameCanvas';
import { supabase } from '../supabaseClient';

function GameLogic({ gridProps }) {

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

    const [turn, setTurn] = useState('O');
    const [table, setTable] = useState(createEmptyTable(gridCount));
    const [winner, setWinner] = useState('');
    const [id, setId] = useState(0);

    // json handle

    const [tablejson, setTablejson] = useState('');

    const fetchTable = () => {

        setTablejson(JSON.stringify(table))

    }

    // createRoom

    const createRoom = async () => {

        const { data, error } = await supabase.from('game_tables').insert([
            { board_state: tablejson, current_turn: turn, winner: winner }

        ]).select('*')

        if (error) {

            console.log('Error', error)

        } else {

            console.log('Create Room Complete!', data.map((n) => {
                return n.id;
            }))

            setId(data.map((n) => {
                return n.id;
            }))
        }

    }

    // update

    const updateTable = async () => {
        const { data, error } = await supabase
            .from('game_tables')
            .update({ board_state: tablejson, current_turn: turn, winner: winner })
            .eq('id', id)
            .select('*');

        if (error) {
            console.error('Error updating user data:', error.message);
        } else {
            console.log('User data updated successfully:', data);
        }
    };


    const canvasRef = useRef(null);
    const ctxRef = useRef(null);
    const [click, setClick] = useState(true);

    useEffect(() => {

        const c = canvasRef.current;
        const ctx = c.getContext("2d");
        ctxRef.current = ctx;
        drawAll();
        createRoom();

        
    }, []);

    useEffect(() => {

        fetchTable();
        updateTable();

        drawAll();
        if (winCheck()) {
            alert(`Player ${turn} wins!`);
            setWinner(turn)
            setClick(false);
        } else if (table.flat().every(cell => cell !== '')) {
            alert('Draw');
            setWinner('Draw')
            setClick(false);
        }

        setTurn(turn === 'O' ? 'X' : 'O');

        console.log(id);

    }, [table]);

    const handleClick = e => {
        const x = e.nativeEvent.offsetX;
        const y = e.nativeEvent.offsetY;

        let col = Math.floor(x / cellSize);
        let row = Math.floor(y / cellSize);

        if (click && row < gridCount && table[row][col] === '') {
            const newTable = table.map(r => [...r]);
            newTable[row][col] = turn;
            setTable(newTable);
        }
    };

    const drawAll = () => {
        const ctx = ctxRef.current;
        ctx.clearRect(0, 0, 600, 700)
        drawMarks();

    }


    const drawMarks = () => {
        const ctx = ctxRef.current;
        ctx.strokeStyle = "#f39899ff";
        ctx.lineWidth = gridCount / gridCount * 5;
        for (let row = 0; row < gridCount; row++) {
            for (let col = 0; col < gridCount; col++) {
                const mark = table[row][col];
                if (mark === 'O') {
                    ctx.beginPath();
                    ctx.arc(col * cellSize + (cellSize / 2), row * cellSize + (cellSize / 2), (cellSize * (1 / 3)), 0, 2 * Math.PI);
                    ctx.stroke();
                } else if (mark === 'X') {
                    ctx.beginPath();
                    ctx.moveTo(col * cellSize + (cellSize * 0.15), row * cellSize + (cellSize * 0.15));
                    ctx.lineTo(col * cellSize + (cellSize * 0.85), row * cellSize + (cellSize * 0.85));
                    ctx.moveTo(col * cellSize + (cellSize * 0.85), row * cellSize + (cellSize * 0.15));
                    ctx.lineTo(col * cellSize + (cellSize * 0.15), row * cellSize + (cellSize * 0.85));
                    ctx.stroke();
                }
            }
        }
    }

    function arraySameCheck(arr) { //check ว่า ทั้ง array นั้นเหมือนกันไหม (ใช้ร่วมกับ isWin())

        for (let i = 0; i < arr.length; i++) {

            for (let j = 0; j < arr.length; j++) {

                if (arr[i] !== arr[j]) {


                    return false; //ถ้าเจอไม่เหมือน return false
                }

            }
        }

        if (arr.includes('')) { //ถ้ามีฟันหนูซักอันใน array ที่ส่งเข้ามา return false

            return false;

        }

        return true; //ถ้า array เหมือนกันทั้งหมด return true

    }

    const winCheck = () => {

        let row = table.length; //3
        const checkBoard = [];

        // แนวนอน
        for (let i = 0; i < row; i++) { // column

            for (let j = 0; j < row; j++) { // row  

                checkBoard.push(table[i][j]);

            }
            if (arraySameCheck(checkBoard) === true) { //เช็คว่า checkBoard ทั้งarrayเหมือนกันไหม 

                console.log('แนวนอนชนะ');
                return true;

            }

            checkBoard.length = 0;
        }

        for (let i = 0; i < row; i++) { // column

            for (let j = 0; j < row; j++) { // row  

                checkBoard.push(table[j][i]);

            }
            if (arraySameCheck(checkBoard) === true) { //เช็คว่า checkBoard ทั้งarrayเหมือนกันไหม 

                console.log('แนวตั้งชนะ');
                return true;

            }

            checkBoard.length = 0;
        }

        for (let i = 0; i < row; i++) { // column

            checkBoard.push(table[i][i]);

        }

        if (arraySameCheck(checkBoard) === true) { //เช็คว่า checkBoard ทั้งarrayเหมือนกันไหม 

            console.log('แนวเฉียงขวา');
            return true;

        }

        checkBoard.length = 0;

        for (let i = 0; i < row; i++) { // column

            checkBoard.push(table[i][(row - 1) - i]);

        }

        if (arraySameCheck(checkBoard) === true) { //เช็คว่า checkBoard ทั้งarrayเหมือนกันไหม 

            console.log('แนวเฉียงซ้าย');
            return true;

        }

        checkBoard.length = 0;



    };

    const resetGame = () => {
        setTable(Array.from({ length: gridCount }, () => Array(gridCount).fill('')));
        setTurn('O');
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
