import React from 'react'
import { useState } from 'react'

function NumberInput({ setTurn, turn , grid}) {

  return (
    <>

      <form >

        <input
          type="number"
          placeholder='ใส่ตัวเลข'
          value={turn}
          style={{ padding: 10 }}

          onChange={(e) => setTurn(Number(e.target.value))} 

          />

      </form>

      {turn > grid || turn < 1 ? setTurn(1) : null}

    </>
  )
}

export default NumberInput