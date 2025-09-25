import React from 'react'

function NumberInput({setTurn , turn}) {
  return (
    <>
    
        <form >

            <input 
            type="number" 
            placeholder='ใส่ตัวเลข' 
            value={turn}
            style={{padding : 10}}
            
            onChange={(e) => setTurn(Number(e.target.value))}/>


        </form>
    
    </>
  )
}

export default NumberInput