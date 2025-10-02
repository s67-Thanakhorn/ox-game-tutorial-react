import React from 'react'
import { useState , useEffect} from 'react';

function GridInput({ grid , setGrid }) {

    const [local, setLocal] = useState(String(grid));
    useEffect(() => setLocal(String(grid)), [grid]);

    const apply = () => {
        const n = Number(local);
        if (Number.isInteger(n)) {
            
            localStorage.setItem("grid", String(n));
            
            window.location.reload();
        } 
    };

    return (
        <div>
            <input
                type="text"
                onChange={(e) => setGrid(e.target.value)}
                placeholder='ใส่ขนาดของตาราง'
                style={{ position: 'relative', padding: 10, top: '580px' }} 
                />
                
                <button 
                onClick={apply} 
                style={{position : 'relative', padding : 10, top : '580px', margin : '10px'}}
                >ตกลง</button>

        </div>
    )
}

export default GridInput