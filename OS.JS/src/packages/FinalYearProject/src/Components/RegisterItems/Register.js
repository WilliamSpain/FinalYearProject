import React,{useContext, useEffect} from 'react';
import './register.css'
import {cpuContext} from "../../Providers/CPUProvider";
const Register = ({register}) => {

    const [cpu,setCpu] =useContext(cpuContext)

    function getRegister (register){
        if(register === 'AL') return 0;
        else if(register === "BL") return 1;
        else if(register === "CL") return 2;
        else return 3;
    }
    var regIndex = getRegister(register)
    var regValue = cpu.registers[regIndex]
    var regHex = regValue.toString(16)
    var regByte;

    return (
      <div className="register-box">
          <div id={"register-title-"+register} className="register-title">{register}</div>
          <div id={"register-dec-"+register} className="register-dec"> D: {regValue}</div>
          <div id={"register-hex-"+register} className="register-hex"> H: 0x{regHex.toUpperCase()}</div>
          <div id={"register-bin-"+register} className="register-byte"> B: 00000000</div>
      </div>
    );
}

export default Register;
