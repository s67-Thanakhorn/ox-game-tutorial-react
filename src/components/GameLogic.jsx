import React from 'react'

function GameLogic() {

    const handleClick = e => {

        let row = Math.floor(e.nativeEvent.offsetX / 200);
        let col = Math.floor(e.nativeEvent.offsetY / 200);

        console.log(row , col);
    };   


  return (
    <>
        <canvas
        id="myCanvas"
        width="600"
        height="600"
        style={{position: "absolute"}}
        
        onClick={handleClick}
        ></canvas>

    </>
  )
}

export default GameLogic