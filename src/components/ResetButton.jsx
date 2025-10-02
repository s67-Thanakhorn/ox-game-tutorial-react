import React from "react";

function ResetButton({ onReset }) {
  return (
    <div>

      <button onClick={onReset} style={{position : "relative" , padding : 10 , top : '590px' , left : '520px'}}>
        รีสตาร์ทเกม
      </button>
    </div>
  );
}

export default ResetButton;
