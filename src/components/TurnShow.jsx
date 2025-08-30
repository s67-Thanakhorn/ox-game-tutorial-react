import React from 'react'

function Turnshow({turn}) {
  return (
    <div>
        
        <p
        style={{padding : 10, fontSize : 30, fontWeight : 'bold'}}
        >Turn : {turn}</p>

    </div>
  )
}

export default Turnshow