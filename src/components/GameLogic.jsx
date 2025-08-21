import React, { useEffect, useRef, useState } from 'react'

function GameLogic() {
    const [turn, setTurn] = useState('O');
    const [table, setTable] = useState([['', '', ''], ['', '', ''], ['', '', '']]);
    const canvasRef = useRef(null);
    const ctxRef = useRef(null);
    const [click, setClick] = useState(true);

    let p = 0;
    let i = 50;
    let j = 50;
    let k = 30;
    let l = 170;

    useEffect(() => {
        const c = canvasRef.current;
        const ctx = c.getContext("2d");
        ctxRef.current = ctx;

        drawAll();
    }, []);

    useEffect(() => {
        drawAll();
        if (winCheck()) {
            alert(`Player ${turn} wins!`);
            setClick(false);
        } else if (table.flat().every(cell => cell !== '')) {
            alert('Draw');
            setClick(false);
        }

        setTurn(turn === 'O' ? 'X' : 'O');
        
    }, [table]);


    const handleClick = e => {
        const x = e.nativeEvent.offsetX;
        const y = e.nativeEvent.offsetY;

        if (x >= 200 && x <= 400 && y >= 610 && y <= 650) {
            resetGame();
            return;
        }

        let col = Math.floor(x / 200);
        let row = Math.floor(y / 200);
        

        if (click && row < 3 && table[row][col] === '') {
            const newTable = table.map(r => [...r]);
            newTable[row][col] = turn;
            setTable(newTable);
            
        }
    };

    const drawAll = () => {

        drawMarks();

    }

    const drawMarks = () => {
        const ctx = ctxRef.current;
        ctx.strokeStyle = "#f39899ff";
        ctx.lineWidth = 7;


        for (let row = 0; row < 3; row++) {
            for (let col = 0; col < 3; col++) {
                const mark = table[row][col];
                if (mark === 'O') {
                    ctx.beginPath();
                    ctx.arc(col * 200 + 100, row * 200 + 100, 70, 0, 2 * p);
                    ctx.stroke();


                } else if (mark === 'X') {
                    ctx.beginPath();
                    ctx.moveTo(col * 200 + 30, row * 200 + 30);
                    ctx.lineTo((col * 200 )+ j, (row * 200)+i);

                    ctx.moveTo(col * 200 + 170, row * 200 + 30);
                    ctx.lineTo((col * 200 ) + l, (row * 200 ) + k);

                    ctx.stroke();
                }
            }
        }

        p += 0.25;

        if ( i < 170) {

            i += 10;
            j += 10;

        }if ( k !== 170) {

            k += 10;
            
        }if (l !== 30) {

            l -= 10;
        }

        requestAnimationFrame(drawMarks);

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

            checkBoard.push(table[i][(row-1)-i]);
            
        }

        if (arraySameCheck(checkBoard) === true) { //เช็คว่า checkBoard ทั้งarrayเหมือนกันไหม 

            console.log('แนวเฉียงซ้าย');
            return true;

        }

        checkBoard.length = 0;
        


    };

    const resetGame = () => {
        setTable([['', '', ''], ['', '', ''], ['', '', '']]);
        setTurn('O');
        setClick(true);
    };

    return (
        <canvas
            ref={canvasRef}
            width="600"
            height="700"
            style={{ position: "absolute" }}
            onClick={handleClick}
        ></canvas>
    )
}

export default GameLogic;
