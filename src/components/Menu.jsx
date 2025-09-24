import React from 'react'

export default function Menu({setScene}) {
  return (
    <>
    
        <button 
        
        onClick={() => setScene(prev => !prev)}
        >Click to change scene</button>

    </>
    
  )
}
