import React, { useEffect, useRef, useState } from 'react'
import ResetButton from '../ResetButton';
import GameCanvas from '../GameCanvas';
import ShowText from '../ShowText';
import { supabase } from '../../supabaseClient';

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
    const [winner, setWinner] = useState('');

    const [id, setId] = useState(0); // ตัวแปรเก็บค่าไอดี
    const displayId = Array.isArray(id) ? id[0] : id; // เนื่องจากไอดีที่ได้จากฟังก์ชัน map เป็น array ต้องแปลงเป็น int


    // json handle

    const [tablejson, setTablejson] = useState(''); // ตัวแปรเก็บค่าตารางที่เป็น Object แบบ json


    const fetchTable = () => { // ฟังก์ชันเซ็ตค่า tablejson เป็น table array => object json

        setTablejson(JSON.stringify(table)) 

    }

    // createRoom ฟังก์ชันสร้างห้อง หรือ เพิ่ม row ใหม่เข้าไปใน supabase

    const createRoom = async () => {

        const { data, error } = await supabase.from('game_tables').insert([ // หา table ที่ชื่อ game_tables แล้ว insert หรือเพิ่มข้อมูลเข้าไป
            { board_state: tablejson, current_turn: turn, winner: winner } // เพิ่มข้อมูลเป็น row ใหม่ขึ้นมาตาม column ใน supabase

        ]).select('*') // เลือกให้เพิ่มทั้งหมด

        if (error) { //ถ้าเจอ error ให้ log สาเหตุใส่ใน console

            console.log('Error', error)

        } else { //ถ้าไม่เจอ error

            console.log('Create Room Complete!', data.map((n) => { //log ว่าทำสำเร็จ แล้วบอกค่าเลขห้องมา โดยใช้ map วนใน json object แล้วเอาแค่ id ออกมา
                return n.id;
            }))

            setId(data.map((n) => { //set ค่า i เป็นค่า id ที่เราใช้ map วน
                return n.id;
            }))
        }

    }

    // update ฟังก์ชันอัพเดตค่าใน row เมื่อมีการ click เกิดขึ้น (ใช้ร้วมกับ useEffect table event)

    const updateTable = async () => {
        const { data, error } = await supabase 
            .from('game_tables') // เรียก table ที่ชื่อ game_tables ใน supabase
            .update({ board_state: tablejson, current_turn: turn, winner: winner }) // กำหนดค่าใน row 
            .eq('id', id) // อ้างอิง id เพื่อแก้ไขข้อมูลให้ถูก row 
            .select('*'); // เพิ่มข้อมูลเข้าไปทุกๆ row

        if (error) { // ถ้า error ให้ log ค่าออกมา
            console.error('Error updating user data:', error.message);
        } else { // ถ้าไม่เจอก็บอกว่าสำเร็จ
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

        createRoom(); // ใช้ฟังก์ชัน createRoom เมื่อมีการ mount 

    }, []);

    useEffect(() => {

        fetchTable(); // ใช้ฟังก์ชัน fetchTable เมื่อค่าใน table เปลี่ยนแปลง
        updateTable(); // ใช้ฟังก์ชัน updateTable เมื่อค่าใน table เปลี่ยนแปลง

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
        
        <h2 style={{position : 'relative' , left : 450 , bottom : 50}}>Room ID : {displayId || 'creating...'}</h2>
        <canvas
            ref={canvasRef}
            width="600"
            height="600"
            style={{ position: "absolute", bottom : 40 , left : 12  }}
            onClick={handleClick}
        > </canvas>
        <ResetButton onReset={resetGame} />
    </>


    )
}

export default GameLogic;
