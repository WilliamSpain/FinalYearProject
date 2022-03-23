import React, {useRef} from 'react';
import './hexTableGen.css'

const hex = ['0','1','2','3','4','5','6','7','8','9','A','B','C','D','E','F']

const cells = hex.map((character) =>
  <th className="hexCellOuter" key={'-'+character}>{character}</th>)




const rows = hex.map((characterLeft)=>
    <tr className="hexCell">
        <th className="hexCellOuter" key={characterLeft+'-'}>{characterLeft}</th>
        {hex.map((characterRight)=>
            <th className="hexCell" id={characterLeft+characterRight} key={characterLeft+characterRight} >0</th>
        )}
    </tr>
)


const HexTableGen = () => {
    const myRef=useRef(null);

    function handleHexDec(){
        if(document.getElementById("hexDecButton").innerText === "To Hex"){
            for(var i = 0; i < 16; i++){
                for(var j = 0; j < 16; j++){
                    if(parseInt(document.getElementById(hex[i]+hex[j]).innerText) >= 10){
                        let cellValue = parseInt(document.getElementById(hex[i]+hex[j]).innerText)
                        document.getElementById(hex[i]+hex[j]).innerText = cellValue.toString(16).toUpperCase().toUpperCase()
                    }
                }
            }
            document.getElementById("hexDecButton").innerText = "To Dec"
        }
        else{
            for(var i = 0; i < 16; i++){
                for(var j = 0; j < 16; j++){
                    if(document.getElementById(hex[i]+hex[j]).innerText !== '0'){
                        let cellValue = document.getElementById(hex[i]+hex[j]).innerText
                        document.getElementById(hex[i]+hex[j]).innerText = parseInt(cellValue,16).toString().toUpperCase()
                    }
                }
            }
            document.getElementById("hexDecButton").innerText = "To Hex"
        }
    }


  return (
      <>
          <table className="hexTable">
            <thead>
              <tr>
                <th className="hexCellOuter">-</th>
                {cells}
              </tr>
            </thead>
            <tbody>
                {rows}
            </tbody>
          </table>
          <div className="hex-dec-button">
            <button id="hexDecButton" onClick={handleHexDec}>To Hex</button>
          </div>
      </>
  );
};

export default HexTableGen;
