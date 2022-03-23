import React,{useContext, useState, useRef, useEffect} from 'react';
import ReactDOM from 'react-dom';
import './mainNavBar.css';
import {assemblerContext} from "../../../Providers/AssemblerProvider";
import {cpuContext} from "../../../Providers/CPUProvider";
import {memoryContext} from "../../../Providers/MemoryProvider";
import Register from "../../RegisterItems/Register";
import LogoSvg from "./SVG/LogoSVG";
import Flags from "../../RegisterItems/Flags";
import MemoryWindowUsage from "../../windowContext/MemoryWindowUsage";
import TrafficLightContainer from "../LogicGames/TrafficLightContainer";
import {WindowContext} from "../../windowContext/WindowContext";


const Navbar = () => {
    const assembler = useContext(assemblerContext)
    const [cpu,setCpu] = useContext(cpuContext)
    const [memory,setMemory] = useContext(memoryContext)
    const { core, proc } = useContext(WindowContext);
    const procSecond = proc;
    var running = false;
    var codeAssembled = false;
    var gameOpen = false;
    var codeRunInterval = useRef();

    function codeAssemble() {
        codeReset()
        var asm = assembler.go(document.getElementsByClassName("ace_content")[0].innerText)
        var opcodeArray = asm.code
        var mappingArray = asm.mapping
        var labelArray = asm.labels
        codeAssembled = true;

        for (var i = 0; i < opcodeArray.length; i++) {
            memory.data[i] = opcodeArray[i];
        }
        //console.log("opcodeArray")
        /*console.log("asm ",asm)
        console.log("cpu ",cpu)
        console.log("memory ",memory)*/
        loadMemory()

    }

    function codeRun (){
        if(codeAssembled === false){
            codeAssemble()
        }
        running = true

        codeRunInterval.current=setTimeout(function(){
            if(codeStep() === true){
                codeRun()
            }
            else{
                printWord()
                codeStop()
                running = false
            }
        },200)
    }

    function codeStop (){
        clearTimeout(codeRunInterval.current)
        running = false

    }

    function codeStep (){
        if(codeAssembled === false){
            codeAssemble()
        }
        try{
            var changes = cpu.step()
            loadMemory()
            updateInfo()
            handleGameUpdate()
            return changes
        }
        catch (e){
            return false
        }

    }

    function codeReset(){

        cpu.reset()
        memory.reset()
        codeAssembled = false
        loadMemory()
        updateInfo()

    }

    function printWord(){
        var word ="";
        for(var i = 232; i < 265; i++){
            let char = String.fromCharCode(memory.data[i]);
            word=word.concat(char)
        }
        console.log("word ",word)
    }

    function loadMemory(){
        try{
            if (document.getElementById('hexDecButton').innerText === 'To Hex') {
                try {
                    for (let i = 0; i < 256; i++) {
                        if (i < 10) {

                            document.getElementById(0 + i.toString(16).toUpperCase()).innerText = memory.data[i].toString().toUpperCase();
                        } else if (i < 16) {
                            document.getElementById(0 + i.toString(16).toUpperCase()).innerText = memory.data[i].toString().toUpperCase();
                        } else {
                            document.getElementById(i.toString(16).toUpperCase()).innerText = memory.data[i].toString().toUpperCase();
                        }
                    }
                } catch (e) {
                }
            } else {
                try {
                    for (let i = 0; i < 256; i++) {
                        if (i < 10) {

                            document.getElementById(0 + i.toString(16).toUpperCase()).innerText = memory.data[i].toString(16).toUpperCase();
                        } else if (i < 16) {
                            document.getElementById(0 + i.toString(16).toUpperCase()).innerText = memory.data[i].toString(16).toUpperCase();
                        } else {
                            document.getElementById(i.toString(16).toUpperCase()).innerText = memory.data[i].toString(16).toUpperCase();
                        }
                    }
                } catch (e) {
                }
            }
        }catch{

        }
    }

    function updateInfo(){
        //flags
        var carryFlag = cpu.carry ? "T" : "F"
        var faultFlag = cpu.fault ? "T" : "F"
        var zeroFlag = cpu.zero ? "T" : "F"
        var ipFlag = cpu.ip
        var spFlag = cpu.stackPointer

        //decimal
        var alDec = Number(cpu.registers[0])
        var blDec = Number(cpu.registers[1])
        var clDec = Number(cpu.registers[2])
        var dlDec = Number(cpu.registers[3])

        //hex
        var alHex = alDec.toString(16).toUpperCase()
        var blHex = blDec.toString(16).toUpperCase()
        var clHex = clDec.toString(16).toUpperCase()
        var dlHex = dlDec.toString(16).toUpperCase()

        //padded binary
        var alBin = alDec.toString(2).padStart(8,'0')
        var blBin = blDec.toString(2).padStart(8,'0')
        var clBin = clDec.toString(2).padStart(8,'0')
        var dlBin = dlDec.toString(2).padStart(8,'0')

        document.getElementById("register-dec-AL").innerText =" D: "+alDec
        document.getElementById("register-hex-AL").innerText =" H: 0x"+alHex
        document.getElementById("register-bin-AL").innerText =" B: "+alBin

        document.getElementById("register-dec-BL").innerText =" D: "+blDec
        document.getElementById("register-hex-BL").innerText =" H: 0x"+blHex
        document.getElementById("register-bin-BL").innerText =" B: "+blBin

        document.getElementById("register-dec-CL").innerText =" D: "+clDec
        document.getElementById("register-hex-CL").innerText =" H: 0x"+clHex
        document.getElementById("register-bin-CL").innerText =" B: "+clBin

        document.getElementById("register-dec-DL").innerText =" D: "+dlDec
        document.getElementById("register-hex-DL").innerText =" H: 0x"+dlHex
        document.getElementById("register-bin-DL").innerText =" B: "+dlBin


        document.getElementById("flag-carry").innerText =carryFlag
        document.getElementById("flag-zero").innerText =zeroFlag
        document.getElementById("flag-fault").innerText =faultFlag
        document.getElementById("flag-ip").innerText =ipFlag
        document.getElementById("flag-sp").innerText =spFlag
    }

    function handleGameSelect(){

        var select = document.getElementById('game-selector');
        var value = select.options[select.selectedIndex].value;

        if(value === "TrafficLightContainer"){
            procSecond.createWindow({
                id: 'gameWindow',
                title: 'game',
                dimension: {width: 700, height: 600},
                position: {left: 100, top: 500}
            }).on('destroy', () => {handleGameUpdate();gameWindow.destroy();})
                .render(($content) => ReactDOM.render(React.createElement(TrafficLightContainer), $content));
        }
        handleGameUpdate()
    }

    function handleGameUpdate(){
        var select = document.getElementById('game-selector');
        var value = select.options[select.selectedIndex].value;

        if(value === "TrafficLightContainer"){
            var alDec = Number(cpu.registers[0])
            var alBin = alDec.toString(2).padStart(8,'0')
            alBin=alBin.split('')
            alBin=alBin.reverse()

            var lights = (alBin[0] === '1' && alBin[1] === '1') ? true : false
            var green = (alBin[2] === '1' && alBin[3] === '1') ? true : false
            var orange = (alBin[4] === '1' && alBin[5] === '1') ? true : false
            var red = (alBin[6] === '1' && alBin[7] === '1') ? true : false
            for(let i = 0; i < alBin.length; i++ ){
                document.getElementById("tl-bit-"+i).innerHTML=alBin[i].toString()
            }
            if(lights){
                document.getElementById("traffic-green").style.fill="green"
                document.getElementById("traffic-orange").style.fill="orange"
                document.getElementById("traffic-red").style.fill="red"
            }else{
                document.getElementById("traffic-green").style.fill =green ? "green" : "#a9a9a9";
                document.getElementById("traffic-orange").style.fill =orange ? "orange" : "#a9a9a9";
                document.getElementById("traffic-red").style.fill =red ? "red" : "#a9a9a9"
            }

        }

    }
    return (
      <>
        <div className="top-pane">
            <Register register={"AL"}/>
            <Register register={"BL"}/>
            <Register register={"CL"}/>
            <Register register={"DL"}/>
            <Flags/>
            <LogoSvg/>
        </div>
        <div className="bottom-pane">
            <div className="editor-control">
                <button id="buttonAssemble" className="btn-assemble" onClick={codeAssemble}>ASSEMBLE</button>
                <button id="buttonRun" className="btn-run" onClick={codeRun}>RUN</button>
                <button id="buttonStop" className="btn-stop" onClick={codeStop} >STOP</button>
                <button id="buttonStep" className="btn-step" onClick={codeStep} >STEP</button>
                <button id="buttonReset" className="btn-Reset" onClick={codeReset} >RESET</button>
            </div>
            <div className="app-control">
                <div className="game-selection">
                    <select id="game-selector" defaultValue="" className="game-choice">
                        <option value="blank">CHOOSE GAME</option>
                        <option value="TrafficLightContainer">Traffic Light</option>

                    </select>
                    <button className="load-game" onClick={handleGameSelect}>LOAD GAME</button>
                </div>
                <div className="memory-help">
                    <MemoryWindowUsage/>
                    <select defaultValue="" className="instruction-help">
                    <option value=""  disabled>INSTRUCTIONS</option>
                    <option disabled="disabled">NONE: 0-0</option>
                    <option disabled="disabled">MOV REG TO REG: 1-1</option>
                    <option disabled="disabled">MOV ADDRESS TO REG: 2-2</option>
                    <option disabled="disabled">MOV REGADDRESS TO REG: 3-3</option>
                    <option disabled="disabled">MOV REG TO ADDRESS: 4-4</option>
                    <option disabled="disabled">MOV REG TO REGADDRESS: 5-5</option>
                    <option disabled="disabled">MOV NUMBER TO REG: 6-6</option>
                    <option disabled="disabled">MOV NUMBER TO ADDRESS: 7-7</option>
                    <option disabled="disabled">MOV NUMBER TO REGADDRESS: 8-8</option>
                    <option disabled="disabled">ADD REG TO REG: 10-A</option>
                    <option disabled="disabled">ADD REGADDRESS TO REG: 11-B</option>
                    <option disabled="disabled">ADD ADDRESS TO REG: 12-C</option>
                    <option disabled="disabled">ADD NUMBER TO REG: 13-D</option>
                    <option disabled="disabled">SUB REG FROM REG: 14-E</option>
                    <option disabled="disabled">SUB REGADDRESS FROM REG: 15-F</option>
                    <option disabled="disabled">SUB ADDRESS FROM REG: 16-10</option>
                    <option disabled="disabled">SUB NUMBER FROM REG: 17-11</option>
                    <option disabled="disabled">INC REG: 18-12</option>
                    <option disabled="disabled">DEC REG: 19-13</option>
                    <option disabled="disabled">CMP REG WITH REG: 20-14</option>
                    <option disabled="disabled">CMP REGADDRESS WITH REG: 21-15</option>
                    <option disabled="disabled">CMP ADDRESS WITH REG: 22-16</option>
                    <option disabled="disabled">CMP NUMBER WITH REG: 23-17</option>
                    <option disabled="disabled">JMP REGADDRESS: 30-1E</option>
                    <option disabled="disabled">JMP ADDRESS: 31-1F</option>
                    <option disabled="disabled">JC REGADDRESS: 32-20</option>
                    <option disabled="disabled">JC ADDRESS: 33-21</option>
                    <option disabled="disabled">JNC REGADDRESS: 34-22</option>
                    <option disabled="disabled">JNC ADDRESS: 35-23</option>
                    <option disabled="disabled">JZ REGADDRESS: 36-24</option>
                    <option disabled="disabled">JZ ADDRESS: 37-25</option>
                    <option disabled="disabled">JNZ REGADDRESS: 38-26</option>
                    <option disabled="disabled">JNZ ADDRESS: 39-27</option>
                    <option disabled="disabled">JA REGADDRESS: 40-28</option>
                    <option disabled="disabled">JA ADDRESS: 41-29</option>
                    <option disabled="disabled">JNA REGADDRESS: 42-2A</option>
                    <option disabled="disabled">JNA ADDRESS: 43-2B</option>
                    <option disabled="disabled">PUSH REG: 50-32</option>
                    <option disabled="disabled">PUSH REGADDRESS: 51-33</option>
                    <option disabled="disabled">PUSH ADDRESS: 52-34</option>
                    <option disabled="disabled">PUSH NUMBER: 53-35</option>
                    <option disabled="disabled">POP REG: 54-36</option>
                    <option disabled="disabled">CALL REGADDRESS: 55-37</option>
                    <option disabled="disabled">CALL ADDRESS: 56-38</option>
                    <option disabled="disabled">RET: 57-39</option>
                    <option disabled="disabled">MUL REG: 60-3C</option>
                    <option disabled="disabled">MUL REGADDRESS: 61-3D</option>
                    <option disabled="disabled">MUL ADDRESS: 62-3E</option>
                    <option disabled="disabled">MUL NUMBER: 63-3F</option>
                    <option disabled="disabled">DIV REG: 64-40</option>
                    <option disabled="disabled">DIV REGADDRESS: 65-41</option>
                    <option disabled="disabled">DIV ADDRESS: 66-42</option>
                    <option disabled="disabled">DIV NUMBER: 67-43</option>
                    <option disabled="disabled">AND REG WITH REG: 70-46</option>
                    <option disabled="disabled">AND REGADDRESS WITH REG: 71-47</option>
                    <option disabled="disabled">AND ADDRESS WITH REG: 72-48</option>
                    <option disabled="disabled">AND NUMBER WITH REG: 73-49</option>
                    <option disabled="disabled">OR REG WITH REG: 74-4A</option>
                    <option disabled="disabled">OR REGADDRESS WITH REG: 75-4B</option>
                    <option disabled="disabled">OR ADDRESS WITH REG: 76-4C</option>
                    <option disabled="disabled">OR NUMBER WITH REG: 77-4D</option>
                    <option disabled="disabled">XOR REG WITH REG: 78-4E</option>
                    <option disabled="disabled">XOR REGADDRESS WITH REG: 79-4F</option>
                    <option disabled="disabled">XOR ADDRESS WITH REG: 80-50</option>
                    <option disabled="disabled">XOR NUMBER WITH REG: 81-51</option>
                    <option disabled="disabled">NOT REG: 82-52</option>
                    <option disabled="disabled">SHL REG WITH REG: 90-5A</option>
                    <option disabled="disabled">SHL REGADDRESS WITH REG: 91-5B</option>
                    <option disabled="disabled">SHL ADDRESS WITH REG: 92-5C</option>
                    <option disabled="disabled">SHL NUMBER WITH REG: 93-5D</option>
                    <option disabled="disabled">SHR REG WITH REG: 94-5E</option>
                    <option disabled="disabled">SHR REGADDRESS WITH REG: 95-5F</option>
                    <option disabled="disabled">SHR ADDRESS WITH REG: 96-60</option>
                    <option disabled="disabled">SHR NUMBER WITH REG: 97-67</option>
                </select>
                </div>
            </div>
        </div>
      </>
    );
};
export default Navbar;
