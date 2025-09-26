// SudokuBoard.jsx
import { useState } from 'react';
import PossibleNum from './PossibleNum';

const initialBoard = [
  [5, 1, 4, 2, 3],
  ['', '', '', 1, ''],
  ['', '', '', 5, ''],
  ['', '', '', 4, ''],
  ['', '', '', 3, ''],
];

export default function SudokuBoard() {
  const [board, setBoard] = useState(initialBoard);

  const handleChange = (r, c) => (e) => {

    const digit = e.target.value;

    // ถ้าลบจนว่าง ก็ล้างช่องแล้วจบ
    if (digit === '') {
      setBoard(prev => {
        const cp = prev.map(row => [...row]);
        cp[r][c] = '';
        return cp;
      });
      return;
    }

    const val = Number(digit); 

    // อัปเดตก่อน
    const next = board.map(row => [...row]);
    next[r][c] = val;
    setBoard(next);

    // แล้วค่อยเช็คซ้ำ
    const ok = PossibleNum(next, r, c, val);

    if (!ok) {
      alert('วางไม่ได้เลขซ้ำในแถวหรือคอลัมน์');
      setBoard(prev => {
        const cp = prev.map(row => [...row]);
        cp[r][c] = ''; // ลบทิ้ง
        return cp;
      });
    }
  };

  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(5, 80px)',
        gap: '4px',
        padding: '6px',
        border: '2px solid #ff6cd5ff',
        borderRadius: '6px',
        width: 'max-content',
      }}
    >
      {board.map((row, r) =>
        row.map((cell, c) => {
          const fixed = initialBoard[r][c] !== '';
          return (
            <input
              key={`${r}-${c}`}
              type="text"
              inputMode="numeric"
              maxLength={1}       // รับ 1 ตัว
              value={cell === '' ? '' : String(cell)}
              onChange={handleChange(r, c)}
              disabled={fixed}
              style={{
                width: 80,
                height: 80,
                textAlign: 'center',
                fontSize: 40,
                background: fixed ? '#f3f3f3' : 'white',
                border: '1px solid #67335bff',
                borderRadius: 8,
                outline: 'none',
              }}
            />
          );
        })
      )}
    </div>
  );
}
