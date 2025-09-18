import { useState, useEffect } from 'react';

function PossibleNum({ item, AddNum }) {

    let row = table.length;
    const CheckBoardRow = [];
    const CheckBoardColumn = [];
    const mark = [];

    // แนวนอน
    for (let i = 0; i < row; i++) { // column

        for (let j = 0; j < row; j++) { // row  

            CheckBoardRow.push(table[i][j]);
        }
    }
    // แนวตั้ง
    for (let i = 0; i < row; i++) { // column

        for (let j = 0; j < row; j++) { // row  

            CheckBoardColumn.push(table[j][i]);
        }
    }
    item.mark ==  CheckBoardRow && CheckBoardColumn.push ?  : 

}
    export default PossibleNum