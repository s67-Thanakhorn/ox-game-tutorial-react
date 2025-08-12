import React, { useEffect, useRef, useState } from 'react'

function GameLogic() {

    // ตัวแปรเทิร์น
    const [turn, setTurn] = useState('O');

    // ตัวแปรตาราง XO
    const [table, setTable] = useState([['', '', ''],
    ['', '', ''],
    ['', '', '']]);

    // อ้างอิง id จาก canvas แทนการใช้ getElementById
    const canvasRef = useRef(null);

    // อ้างอิงตัวแปร ctx ใน useEffect เนื่องจากเป็น local 
    const ctxRef = useRef(null);

    // กำหนดการคลิกเมื่อจบเกม ถ้าเป็น true = กดได้ , flase = กดไม่ได้ (หลังเกมจบ)
    const [click,setClick] = useState(true);
    
    useEffect(() => {
        const c = canvasRef.current;
        const ctx = c.getContext("2d");
        ctxRef.current = ctx;
    }, []);

    // จะทำต่อเมื่อ table มีการเปลี่ยนค่า
    useEffect(() => {

        // ถ้า winCheck return = true คือมีคนชนะ
        if (winCheck()) {

            alert(`Player ${turn} wins!`);
            setClick(false);
        
        // เช็คว่าเต็มไม่มีช่องว่าง = draw
        } else if (table.flat().every(cell => cell !== '')) {
             
            alert('Draw');
            setClick(false);
        
        // ถ้าเข้าเงื่อนไชก็เปลี่ยนเทิร์น
        }else {

            changeTurn();
        }


    }, [table]);

    // ฟังก์ชัน รับมือการกด
    const handleClick = e => {

        // รับค่าพิกัดของเมาส์แล้วมาเปลงเป็น row , column
        let row = Math.floor(e.nativeEvent.offsetX / 200);
        let col = Math.floor(e.nativeEvent.offsetY / 200);


        if (click) {

            draw(row, col);

        }

    };

    // ฟังก์ชัน เปลี่ยนเทิร์น
    const changeTurn = () => {

        if (turn === 'X') {

            setTurn('O');

        } else {

            setTurn('X');

        }

    };

    // ฟังก์ชันวาด XO ในตาราง 
    const draw = (row, col) => {
        const ctx = ctxRef.current;
        const newTable = table.map(row => [...row]);

        ctx.beginPath();
        ctx.strokeStyle = "#f39899ff";
        ctx.lineWidth = 7;


        if (turn === 'O' && table[row][col] === '') {

            newTable[row][col] = turn;
            setTable(newTable);

            ctx.arc((row * 200) + 100, (col * 200) + 100, 70, 0, 2 * Math.PI);
            ctx.stroke();

        } else if (turn === 'X' && table[row][col] === '') {

            newTable[row][col] = turn;
            setTable(newTable);

            ctx.moveTo(((row) * 200) + 30, ((col) * 200) + 30);
            ctx.lineTo(((row + 1) * 200) - 30, ((col + 1) * 200) - 30);

            ctx.moveTo(((row + 1) * 200) - 30, ((col) * 200) + 30);
            ctx.lineTo(((row) * 200) + 30, ((col + 1) * 200) - 30);


            ctx.stroke();

        }

    }

    // ฟังก์ชันเช็คเงื่อนไขการชนะ
    const winCheck = () => {

        let turnValue = ['X', 'O'];

        for (let i = 0; i < turnValue.length; i++) {

            if (table[0][0] === turnValue[i] && table[0][1] === turnValue[i] && table[0][2] === turnValue[i]) {

                return true;

            } else if (table[1][0] === turnValue[i] && table[1][1] === turnValue[i] && table[1][2] === turnValue[i]) {

                return true;

            } else if (table[2][0] === turnValue[i] && table[2][1] === turnValue[i] && table[2][2] === turnValue[i]) {

                return true;

            } else if (table[0][0] === turnValue[i] && table[1][0] === turnValue[i] && table[2][0] === turnValue[i]) {

                return true;

            } else if (table[0][1] === turnValue[i] && table[1][1] === turnValue[i] && table[2][1] === turnValue[i]) {

                return true;

            } else if (table[0][2] === turnValue[i] && table[1][2] === turnValue[i] && table[2][2] === turnValue[i]) {

                return true;

            } else if (table[0][0] === turnValue[i] && table[1][1] === turnValue[i] && table[2][2] === turnValue[i]) {

                return true;

            } else if (table[0][2] === turnValue[i] && table[1][1] === turnValue[i] && table[2][0] === turnValue[i]) {

                return true;

            }

        }

    }

    return (
        <>
            <canvas
                ref={canvasRef}
                id="myDrawCanvas"
                width="600"
                height="600"
                style={{ position: "absolute" }}

                onClick={handleClick}
            ></canvas>

        </>
    )
}

export default GameLogic