import React from "react";

function ResetButton({ onReset }) {
  return (
    <div>

      <button onClick={onReset} style={{position : "relative", top : 590, left : 540, padding : 3}}>
        รีสตาร์ทเกม
      </button>
    </div>
  );
}

export default ResetButton;
