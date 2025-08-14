import React, { useEffect, useRef, useState } from 'react'

function GameLogic() {
    const [turn, setTurn] = useState('O');
    const [table, setTable] = useState([['', '', ''], ['', '', ''], ['', '', '']]);
    const canvasRef = useRef(null);
    const ctxRef = useRef(null);
    const [click, setClick] = useState(true);

    useEffect(() => {
        const c = canvasRef.current;
        const ctx = c.getContext("2d");
        ctxRef.current = ctx;
        drawGrid();
        drawResetButton();
    }, []);

    useEffect(() => {
        if (winCheck()) {
            alert(`Player ${turn} wins!`);
            setClick(false);
        } else if (table.flat().every(cell => cell !== '')) {
            alert('Draw');
            setClick(false);
        } else {
            changeTurn();
        }
    }, [table]);

    const handleClick = e => {
        const x = e.nativeEvent.offsetX;
        const y = e.nativeEvent.offsetY;

        // ตรวจว่าคลิกในปุ่ม reset หรือไม่
        if (x >= 200 && x <= 400 && y >= 610 && y <= 650) {
            resetGame();
            return;
        }

        let row = Math.floor(x / 200);
        let col = Math.floor(y / 200);

        if (click && col < 3) {
            draw(row, col);
        }
    };

    const changeTurn = () => {
        setTurn(turn === 'X' ? 'O' : 'X');
    };

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
    };

    const winCheck = () => {
        let turnValue = ['X', 'O'];
        for (let i = 0; i < turnValue.length; i++) {
            if (table[0][0] === turnValue[i] && table[0][1] === turnValue[i] && table[0][2] === turnValue[i]) return true;
            if (table[1][0] === turnValue[i] && table[1][1] === turnValue[i] && table[1][2] === turnValue[i]) return true;
            if (table[2][0] === turnValue[i] && table[2][1] === turnValue[i] && table[2][2] === turnValue[i]) return true;
            if (table[0][0] === turnValue[i] && table[1][0] === turnValue[i] && table[2][0] === turnValue[i]) return true;
            if (table[0][1] === turnValue[i] && table[1][1] === turnValue[i] && table[2][1] === turnValue[i]) return true;
            if (table[0][2] === turnValue[i] && table[1][2] === turnValue[i] && table[2][2] === turnValue[i]) return true;
            if (table[0][0] === turnValue[i] && table[1][1] === turnValue[i] && table[2][2] === turnValue[i]) return true;
            if (table[0][2] === turnValue[i] && table[1][1] === turnValue[i] && table[2][0] === turnValue[i]) return true;
        }
    };

    const drawGrid = () => {
        const ctx = ctxRef.current;
        ctx.clearRect(0, 0, 600, 700);
        ctx.strokeStyle = "#ccc";
        ctx.lineWidth = 2;
        for (let i = 1; i < 3; i++) {
            ctx.beginPath();
            ctx.moveTo(i * 200, 0);
            ctx.lineTo(i * 200, 600);
            ctx.stroke();
            ctx.beginPath();
            ctx.moveTo(0, i * 200);
            ctx.lineTo(600, i * 200);
            ctx.stroke();
        }
    };

   const drawResetButton = () => {
        const ctx = ctxRef.current;
        ctx.fillStyle = "#ff9999";
        ctx.fillRect(200, 610, 200, 40);
        ctx.strokeStyle = "#000";
        ctx.strokeRect(200, 610, 200, 40);
        ctx.fillStyle = "#000";
        ctx.font = "20px Arial";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText("RESET", 300, 630);
    };

    const resetGame = () => {
        setTable([['', '', ''], ['', '', ''], ['', '', '']]);
        setTurn('O');
        setClick(true);
        drawGrid();
        drawResetButton();
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
