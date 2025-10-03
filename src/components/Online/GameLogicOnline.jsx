import React, { useEffect, useRef, useState } from 'react'
import ResetButton from '../ResetButton';
import GameCanvas from '../GameCanvas';
import ShowText from '../ShowText';
import { supabase } from '../../supabaseClient';

function GameLogic({ gridProps, turn, setTurn, player1, player2 }) {

  const boardSize = 600;
  const gridCount = Number(gridProps)
  const cellSize = boardSize / gridCount;

  const createEmptyTable = (gridCount) => {
    const tableArray = [];
    for (let i = 0; i < gridCount; i++) {
      const row = [];
      for (let j = 0; j < gridCount; j++) row.push('');
      tableArray.push(row);
    }
    return tableArray;
  };

  const [text, setText] = useState('');

  const [table, setTable] = useState(createEmptyTable(gridCount));
  const [winner, setWinner] = useState('');

  const [id, setId] = useState(0);
  const displayId = Array.isArray(id) ? id[0] : id;
  const savedRoomId = localStorage.getItem('roomId') || '';

  let myId = localStorage.getItem("my_uuid");
  if (!myId) {
    myId = crypto.randomUUID();
    localStorage.setItem("my_uuid", myId);
  }


  const serializeBoard = () => JSON.stringify({
    grid_count: gridCount,
    board: table
  });

  const createRoom = async () => {

    const payload = {
      board_state: serializeBoard(),
      current_turn: turn,
      winner: winner,
      status: text,
      player1_id: myId,   // คนสร้างห้องคือ Player1
      player2_id: null,
    };

    const { data, error } = await supabase
      .from('game_tables')
      .insert([payload])
      .select('id')
      .single();

    if (error) {
      console.log('Error', error);
    } else {
      console.log('Create Room Complete! id =', data.id);
      setId(data.id);
      localStorage.setItem('roomId', String(data.id));
      localStorage.setItem('scene1', 'Onlineplayer');
    }
  };

  // สำหรับ player2
  const joinRoom = async () => {
    const { error } = await supabase
      .from('game_tables')
      .update({ player2_id: myId })
      .eq('id', displayId)
      .select('*')
      .is('player2_id', null)
      .single();

    if (error) {

      console.error();

    }
  };


  const canvasRef = useRef(null);
  const ctxRef = useRef(null);
  const [click, setClick] = useState(false);

  // --- FLAG ป้องกันลูป: ถ้าอัปเดตมาจาก realtime จะไม่ persist ซ้ำ
  const fromServerRef = useRef(false);

  useEffect(() => {


    console.log(player1, player2)

    const c = canvasRef.current;
    const ctx = c.getContext("2d");
    ctxRef.current = ctx;
    drawAll();

    if (savedRoomId) {
      setId(Number(savedRoomId));
      return;
    }

    if (player1 === true) {

      createRoom();

    }

  }, []);


  useEffect(() => {
    if (player2 === true) {
      joinRoom();
    }
  }, [player2, displayId]);

  // โหลดสถานะครั้งแรกของห้องนั้น
  useEffect(() => {
    if (!displayId) return;

    (async () => {
      const { data, error } = await supabase
        .from('game_tables')
        .select('*')
        .eq('id', displayId)
        .single();

      if (error || !data) {

        console.log('dont find room')
        setText('Dont find room')

        return;

      };

      if (data.player1_id && data.player2_id) {
        setText('IN GAME');
      } else {
        setText('Waiting...');
      }

      try {
        const bs = data.board_state;
        const parsed = (typeof bs === 'string') ? JSON.parse(bs) : bs;
        const board = Array.isArray(parsed) ? parsed : parsed.board;
        setTable(board);
      } catch { }
      setTurn(data.current_turn);
      setWinner(data.winner || '');

    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [displayId]);


  // --- REALTIME SUBSCRIBE (เพิ่มใหม่)
  useEffect(() => {
    if (!displayId) return;

    const channel = supabase
      .channel(`game_${displayId}`)
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'game_tables',
          filter: `id=eq.${displayId}`
        },

        (payload) => {
          const row = payload.new;

          if (row.winner) {

            setText(`Winner is ${row.winner}`);

          }

          else if (row.player1_id && row.player2_id) { // ถ้าคนก็ขึ้นว่า ingame และสามารถเล่นเกมได้
            setClick(true)
            setText('IN GAME');
            
          } else { // ถ้าคนไม่ครบให้ขึ้นว่าเล่นไม่ได้ และ คลิกทีตารางไม่ได้
            setClick(false) 
            setText('Waiting...');
            
          }

          try {
            const bs = row.board_state;
            const parsed = (typeof bs === 'string') ? JSON.parse(bs) : bs;
            const board = Array.isArray(parsed) ? parsed : parsed.board;

            // ตั้งธงว่าการเปลี่ยนแปลงนี้มาจาก server → กันลูป persist
            fromServerRef.current = true;
            setTable(board);
            setTurn(row.current_turn);
            setWinner(row.winner || '');
          } catch (e) {
            console.error('Realtime parse error:', e);
          }
        }
      )
      .subscribe((status) => {
        console.log('Realtime status:', status);
      });

    return () => {
      supabase.removeChannel(channel);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [displayId]);

  useEffect(() => {
    drawAll();

    // เมื่อ table เปลี่ยน (จากคลิกหรือจาก realtime)
    // ถ้ามาจาก realtime: reset ธงแล้วไม่ persist
    if (fromServerRef.current) {
      fromServerRef.current = false;
      return;
    }

    // เช็คผลชนะ/เสมอ แล้ว persist สถานะขึ้น DB
    let finalWinner = '';
    if (winCheck()) {

      finalWinner = turn;
      setWinner(finalWinner);
      setClick(false);
    } else if (table.flat().every(cell => cell !== '')) {

      finalWinner = 'Draw';
      setWinner(finalWinner);
      setClick(false);
    }

    const nextTurn = (finalWinner || winner) ? turn : (turn === 'O' ? 'X' : 'O');

    // อัปเดต current_turn ให้เป็นคนถัดไป (ถ้ายังไม่มีผู้ชนะ)
    persist({ board: table, currentTurn: nextTurn, finalWinner });

    // ตั้งตาถัดไปใน state ฝั่ง local (ถ้าเกมยังไม่จบ)
    if (!finalWinner) setTurn(nextTurn);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [table]);

  const persist = async ({ board, currentTurn, finalWinner }) => {

    if (!displayId) return;
    const payload = {
      board_state: JSON.stringify({ grid_count: gridCount, board }),
      current_turn: currentTurn,
      winner: finalWinner || '',
      status: text,
    };
    const { error } = await supabase
      .from('game_tables')
      .update(payload)
      .eq('id', displayId);
    if (error) console.error('Persist error:', error.message);

  };

  const handleClick = e => {

    if (!click) return;        

    const x = e.nativeEvent.offsetX;
    const y = e.nativeEvent.offsetY;

    const col = Math.floor(x / cellSize);
    const row = Math.floor(y / cellSize);

    if (click && row < gridCount && table[row][col] === '') {
      const newTable = table.map(r => [...r]);
      newTable[row][col] = turn;
      setTable(newTable);
    }
  };

  const drawAll = () => {
    const ctx = ctxRef.current;
    ctx.clearRect(0, 0, 600, 700)
    drawMarks();
  }

  const drawMarks = () => {
    const ctx = ctxRef.current;
    const fontPx = Math.floor(cellSize * 0.4);
    ctx.font = `${fontPx}px Arial`;

    for (let i = 0; i < gridCount; i++) {
      for (let j = 0; j < gridCount; j++) {
        const cx = j * cellSize + cellSize / 2.8;
        const cy = i * cellSize + cellSize / 1.5;
        ctx.fillText(table[i][j], cx, cy);
      }
    }
  }

  function arraySameCheck(arr) {
    for (let i = 0; i < arr.length; i++) {
      for (let j = 0; j < arr.length; j++) {
        if (arr[i] !== arr[j]) return false;
      }
    }
    if (arr.includes('')) return false;
    return true;
  }

  const winCheck = () => {
    const row = table.length;
    const checkBoard = [];

    // แนวนอน
    for (let i = 0; i < row; i++) {
      for (let j = 0; j < row; j++) checkBoard.push(table[i][j]);
      if (arraySameCheck(checkBoard)) return true;
      checkBoard.length = 0;
    }

    // แนวตั้ง
    for (let i = 0; i < row; i++) {
      for (let j = 0; j < row; j++) checkBoard.push(table[j][i]);
      if (arraySameCheck(checkBoard)) return true;
      checkBoard.length = 0;
    }

    // แนวทแยง \
    for (let i = 0; i < row; i++) checkBoard.push(table[i][i]);
    if (arraySameCheck(checkBoard)) return true;
    checkBoard.length = 0;

    // แนวทแยง /
    for (let i = 0; i < row; i++) checkBoard.push(table[i][(row - 1) - i]);
    if (arraySameCheck(checkBoard)) return true;
    checkBoard.length = 0;

    return false;
  };

  const resetGame = () => {
    setTable(Array.from({ length: gridCount }, () => Array(gridCount).fill('')));
    setTurn('O');
    setClick(true);
    // ล้างผลผู้ชนะใน DB ด้วย
    persist({ board: Array.from({ length: gridCount }, () => Array(gridCount).fill('')), currentTurn: 'O', finalWinner: '' });
  };

  return (
    <>
      <h2 style={{ display: 'inline' }}>Status : {text}</h2>
      <h2 style={{ position: 'relative', left: '450px', bottom: '40px' }}>
        Room ID : {displayId || 'creating...'}
      </h2>


      <canvas
        ref={canvasRef}
        width="600vh"
        height="600vh"
        style={{ position: "absolute",
          pointerEvents: click ? "auto" : "none",
          cursor: click ? "pointer" : "not-allowed",
         }}
        onClick={handleClick}
      />
      <ResetButton onReset={resetGame} />
    </>
  )
}

export default GameLogic;
