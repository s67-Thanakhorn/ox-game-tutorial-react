
export default function PossibleNum(board, r, c, val) {

  //ลงช่องที่ว่างได้
  if (val === '' ) return true;

  //เช็คแถวนอน
  for (let j = 0; j < 5; j++) {
    if (j !== c && board[r][j] === val) return false;
  }

  //เช็คแถวตั้ง
  for (let i = 0; i < 5; i++) {
    if (i !== r && board[i][c] === val) return false; // <-- แก้ตรงนี้
  }

  // ผ่านทั้งแถวและคอลัมน์
  return true;
}
