import React, { useEffect, useRef, useState } from 'react'
import ResetButton from '../ResetButton';
import GameCanvas from '../GameCanvas';
import ShowText from '../ShowText';
import { supabase } from '../../supabaseClient';

function GameLogic({ gridProps , turn , setTurn}) {

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

  const [table, setTable] = useState(createEmptyTable(gridCount));
  const [winner, setWinner] = useState('');

  const [id, setId] = useState(0);
  const displayId = Array.isArray(id) ? id[0] : id;
  const savedRoomId = localStorage.getItem('roomId') || '';

  const [tablejson, setTablejson] = useState('');

  const fetchTable = () => setTablejson(JSON.stringify(table));

  const serializeBoard = () => JSON.stringify({
    grid_count: gridCount,
    board: table
  });

  const createRoom = async () => {
    const payload = {
      board_state: serializeBoard(),
      current_turn: turn,
      winner: winner
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

  const updateTable = async () => {
    const { error } = await supabase
      .from('game_tables')
      .update({
        board_state: serializeBoard(),
        current_turn: turn,
        winner: winner
      })
      .eq('id', id)
      .select('*');

    if (error) console.error('Error updating user data:', error.message);
  };

  const canvasRef = useRef(null);
  const ctxRef = useRef(null);
  const [click, setClick] = useState(true);

  // --- FLAG ป้องกันลูป: ถ้าอัปเดตมาจาก realtime จะไม่ persist ซ้ำ
  const fromServerRef = useRef(false);

  useEffect(() => {
    const c = canvasRef.current;
    const ctx = c.getContext("2d");
    ctxRef.current = ctx;
    drawAll();

    if (savedRoomId) {
      setId(Number(savedRoomId));
      return;
    }
    createRoom();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // โหลดสถานะครั้งแรกของห้องนั้น
  useEffect(() => {
    if (!displayId) return;

    (async () => {
      const { data, error } = await supabase
        .from('game_tables')
        .select('*')
        .eq('id', displayId)
        .single();

      if (error || !data) return;
      try {
        const bs = data.board_state;
        const parsed = (typeof bs === 'string') ? JSON.parse(bs) : bs;
        const board = Array.isArray(parsed) ? parsed : parsed.board;
        setTable(board);
      } catch {}
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
      alert(`Player ${turn} wins!`);
      finalWinner = turn;
      setWinner(finalWinner);
      setClick(false);
    } else if (table.flat().every(cell => cell !== '')) {
      alert('Draw');
      finalWinner = 'Draw';
      setWinner(finalWinner);
      setClick(false);
    }

    const nextTurn = (finalWinner || winner) ? turn : (turn === 'O' ? 'X' : 'O');

    // อัปเดต current_turn ให้เป็นคนถัดไป (ถ้ายังไม่มีผู้ชนะ)
    persist({ board: table, currentTurn: nextTurn, finalWinner });

    // ตั้งตาถัดไปใน state ฝั่ง local (ถ้าเกมยังไม่จบ)
    if (!finalWinner) setTurn(nextTurn);

    console.log('room id =', id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [table]);

  const persist = async ({ board, currentTurn, finalWinner }) => {
    if (!displayId) return;
    const payload = {
      board_state: JSON.stringify({ grid_count: gridCount, board }),
      current_turn: currentTurn,
      winner: finalWinner || ''
    };
    const { error } = await supabase
      .from('game_tables')
      .update(payload)
      .eq('id', displayId);
    if (error) console.error('Persist error:', error.message);
  };

  const handleClick = e => {
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
      <h2 style={{position : 'relative' , left : 450 , bottom : 50}}>
        Room ID : {displayId || 'creating...'}
      </h2>
      <canvas
        ref={canvasRef}
        width="600"
        height="600"
        style={{ position: "absolute", bottom : 250 , left : 12  }}
        onClick={handleClick}
      />
      <ResetButton onReset={resetGame} />
    </>
  )
}

export default GameLogic;
