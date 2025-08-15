import React from "react";

function ResetButton({ onReset }) {
  return (
    <div style={{ textAlign: "center", marginTop: "10px" }}>
      <button onClick={onReset}>
        รีสตาร์ทเกม
      </button>
    </div>
  );
}

export default ResetButton;
