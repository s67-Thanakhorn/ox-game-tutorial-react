import React from 'react'
import { supabase } from '../supabaseClient'

export default function Menu({setScene}) {
  return (
    <>

        <h1 style={{color : "blue", fontSize : 60}}>XO Game</h1>

        <h2>Multiplayer <button onClick={() => setScene('Onlineplayer')} >Create room</button></h2>

        <form >

            <h2>Join room : <input type="text" placeholder='Enter room number' style={{padding : 5}}/><input type="submit" /></h2>
            
        </form>

        <h2>Single player <button onClick={() => setScene('Singleplayer')}>Click here</button></h2>
        
    </>
    
  )
}
