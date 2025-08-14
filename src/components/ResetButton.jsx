import React from "react";

function ResetButton({ onReset }) {
  return (
    <button onClick={onReset} style={{ marginTop: "10px" }}>
      รีสตาร์ทเกม
    </button>
  );
}

export default ResetButton;
