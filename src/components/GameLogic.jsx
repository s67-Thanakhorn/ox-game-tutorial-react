import React, { useEffect, useRef, useState } from 'react'

function GameLogic() {

    const [turn, setTurn] = useState('X');

    const [table, setTable] = useState([['', '', ''],
                                        ['', '', ''],
                                        ['', '', '']]);


    const canvasRef = useRef(null);
    const ctxRef = useRef(null);

    useEffect(() => {
        const c = canvasRef.current;
        const ctx = c.getContext("2d");
        ctxRef.current = ctx;
    }, []);

    const handleClick = e => {

        let row = Math.floor(e.nativeEvent.offsetX / 200);
        let col = Math.floor(e.nativeEvent.offsetY / 200);

        console.log(table);
        changeTurn();
        draw(row,col);

    };

    const changeTurn = () => {

        if (turn === 'X' ) {

            setTurn('O');

        } else {

            setTurn('X');

        }

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

            ctx.arc((row*200)+100,(col*200)+100,70,0,2*Math.PI);
            ctx.stroke();

        }else if (turn === 'X' && table[row][col] === '') {

            newTable[row][col] = turn;
            setTable(newTable);

            ctx.moveTo(((row)*200)+30,((col)*200)+30);
            ctx.lineTo(((row+1)*200)-30,((col+1)*200)-30);

            ctx.moveTo(((row+1)*200)-30,((col)*200)+30);
            ctx.lineTo(((row)*200)+30,((col+1)*200)-30);
            

            ctx.stroke();

        }

    }


    return (
        <>
            <canvas
                ref = {canvasRef}
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