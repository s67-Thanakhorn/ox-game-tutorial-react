import React, { useState } from 'react';

export default function Menu({ setScene }) {
  const [joinId, setJoinId] = useState('');

  return (
    <>

        <h1 style={{color : "blue", fontSize : 60}}>XO Game</h1>

      <h2>
        Multiplayer{" "}
        <button
          onClick={() => {
            localStorage.removeItem('roomId');              // host จะสร้างห้องใหม่ในหน้าเกม
            localStorage.setItem('scene1', 'Onlineplayer'); // เก็บ scene
            setScene('Onlineplayer');
          }}
        >
          Create room
        </button>
      </h2>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          localStorage.setItem('roomId', joinId.trim());   // เลขห้องจากเพื่อน
          localStorage.setItem('scene1', 'Onlineplayer');  // เก็บ scene
          setScene('Onlineplayer');
        }}
      >
        <h2>
          Join room :
          <input
            type="text"
            placeholder="Enter room number"
            style={{ padding: 5 }}
            value={joinId}
            onChange={(e) => setJoinId(e.target.value)}
          />
          <input type="submit" style={{margin : '10px', padding : '5px'}} value={'Enter'}/>
        </h2>
      </form>

      <h2>
        Single player{" "}
        <button
          onClick={() => {
            localStorage.setItem('scene1', 'Singleplayer'); 
            setScene('Singleplayer');
          }}
        >
          Click here!
        </button>
      </h2>
    </>
  );
}
