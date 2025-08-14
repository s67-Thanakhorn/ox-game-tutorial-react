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
            setTurn(turn === 'O' ? 'X' : 'O');
        }
    };

    const drawAll = () => {
        drawGrid();
        drawMarks();
        drawResetButton();
        drawTurn();
    }

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

    const drawMarks = () => {
        const ctx = ctxRef.current;
        ctx.strokeStyle = "#f39899ff";
        ctx.lineWidth = 7;
        for (let row = 0; row < 3; row++) {
            for (let col = 0; col < 3; col++) {
                const mark = table[row][col];
                if (mark === 'O') {
                    ctx.beginPath();
                    ctx.arc(col * 200 + 100, row * 200 + 100, 70, 0, 2 * Math.PI);
                    ctx.stroke();
                } else if (mark === 'X') {
                    ctx.beginPath();
                    ctx.moveTo(col * 200 + 30, row * 200 + 30);
                    ctx.lineTo(col * 200 + 170, row * 200 + 170);
                    ctx.moveTo(col * 200 + 170, row * 200 + 30);
                    ctx.lineTo(col * 200 + 30, row * 200 + 170);
                    ctx.stroke();
                }
            }
        }
    }

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

    const drawTurn = () => {
        const ctx = ctxRef.current;
        ctx.fillStyle = "blue";
        ctx.font = "24px Arial";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText(`ตาเล่น: ${turn}`, 300, 670);
    }

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
