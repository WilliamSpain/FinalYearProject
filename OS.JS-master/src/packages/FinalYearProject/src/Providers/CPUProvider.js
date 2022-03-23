/*
software modified from https://github.com/Schweigi/assembler-simulator provided by MIT licence
 */
import React,{createContext, useState, useContext} from 'react';
import {memoryContext} from "./MemoryProvider";
import {opcodeContext} from "./OPCodeProvider";

export const cpuContext = createContext()

const CpuProvider = (props) => {
    const [memory,setMemory] = useContext(memoryContext)
    const [opcodes,setOpcodes] = useContext(opcodeContext)
    const [cpu,setCpu] = useState(() => {
        return {
            registers:[0, 0, 0, 0],
            stackPointer: 231,
            ip: 0,
            zero: false,
            carry: false,
            fault: false,
            step: function(){
                var self = this
                if(self.fault === true) alert("ERROR: cpu fault, please reset cpu")
                try{
                    var checkRegister=(register)=>{
                        if(register<0 || register >3) alert("ERROR: out of scope register selected in checkRegister()")
                        else{
                            return register
                        }
                    }

                    var checkRegisterSP = (register) => {
                        if(register < 0 || register > 5) alert("ERROR: out of scope register selected")
                        else{
                            return register
                        }
                    }

                    var setRegisterSP = (register,value) => {
                        if(register>=0 || register <4) self.registers[register]=value
                        else if(register === 4){
                            self.stackPointer=value

                            if(self.stackPointer < 0 ) alert("ERROR: Stack overflow")
                            if(self.stackPointer > 231) alert("ERROR: Stack underflow")
                        }
                        else{
                            console.log("index",register)
                            alert("ERROR: out of index register selected in setRegisterSP()")

                        }
                    }

                    var getRegisterSP = (register) => {
                        if(register>=0 || register <=3) return self.registers[register]
                        else if(register === 4) return self.stackPointer
                        else alert("ERROR: out of index register selected in getRegisterSP()")
                    }

                    var indirectRegisterAddress = (value) =>{
                        var register = value % 8
                        var base

                        if(register < 4) base = self.registers[register]
                        else base = self.stackPointer

                        var offset = Math.floor(value/8)
                        if(offset > 15) offset -= 32;

                        return base+offset
                    }

                    var checkOperation = (value) =>{
                        self.zero = false
                        self.carry = false

                        if(value > 255){
                            self.carry = true
                            value = value % 256
                        }
                        else if (value === 0) self.zero = true
                        else if (value < 0) self.carry = true

                        return value
                    }

                    var jump = (newInstructionPointer) => {
                        if(newInstructionPointer <0 || newInstructionPointer >= 256) alert("ERROR: instruction pointer exceeds memory")
                        else self.ip = newInstructionPointer
                    }

                    var push = (value) =>{
                        memory.store(self.stackPointer, value)
                        self.stackPointer--
                        if(self.stackPointer < 0) alert("ERROR stack overflow")
                    }

                    var pop = () =>{
                        var value = memory.load(++self.stackPointer)
                        if(self.stackPointer > 231) alert("ERROR stack underflow")
                        return value
                    }

                    var division = (divisor) => {
                        if (divisor === 0) alert("ERROR: dividing by zero")
                        return Math.floor(self.registers[0]/divisor);
                    };

                    if(self.ip < 0 || self.ip >= 256) alert("ERROR: IP out of scope")

                    var destinationRegister, sourceRegister, destinationMemory, sourceMemory, number;

                    var instruction = memory.load(self.ip);

                    switch(instruction) {
                        case opcodes.NONE:
                            return false;
                        case opcodes.MOV_REG_TO_REG:
                            destinationRegister = checkRegisterSP(memory.load(++self.ip));
                            sourceRegister = checkRegisterSP(memory.load(++self.ip));
                            setRegisterSP(destinationRegister,getRegisterSP(sourceRegister));
                            self.ip++;
                            break;
                        case opcodes.MOV_ADDRESS_TO_REG:
                            destinationRegister = checkRegisterSP(memory.load(++self.ip));
                            sourceMemory = memory.load(++self.ip);
                            setRegisterSP(destinationRegister,memory.load(sourceMemory));
                            self.ip++;
                            break;
                        case opcodes.MOV_REGADDRESS_TO_REG:
                            destinationRegister = checkRegisterSP(memory.load(++self.ip));
                            sourceRegister = memory.load(++self.ip);
                            setRegisterSP(destinationRegister,memory.load(indirectRegisterAddress(sourceRegister)));
                            self.ip++;
                            break;
                        case opcodes.MOV_REG_TO_ADDRESS:
                            destinationMemory = memory.load(++self.ip);
                            sourceRegister = checkRegisterSP(memory.load(++self.ip));
                            memory.store(destinationMemory, getRegisterSP(sourceRegister));
                            self.ip++;
                            break;
                        case opcodes.MOV_REG_TO_REGADDRESS:
                            destinationRegister = memory.load(++self.ip);
                            sourceRegister = checkRegisterSP(memory.load(++self.ip));
                            memory.store(indirectRegisterAddress(destinationRegister), getRegisterSP(sourceRegister));
                            self.ip++;
                            break;
                        case opcodes.MOV_NUMBER_TO_REG:
                            destinationRegister = checkRegisterSP(memory.load(++self.ip));
                            number = memory.load(++self.ip);
                            setRegisterSP(destinationRegister,number);
                            self.ip++;
                            break;
                        case opcodes.MOV_NUMBER_TO_ADDRESS:
                            destinationMemory = memory.load(++self.ip);
                            number = memory.load(++self.ip);
                            memory.store(destinationMemory, number);
                            self.ip++;
                            break;
                        case opcodes.MOV_NUMBER_TO_REGADDRESS:
                            destinationRegister = memory.load(++self.ip);
                            number = memory.load(++self.ip);
                            memory.store(indirectRegisterAddress(destinationRegister), number);
                            self.ip++;
                            break;
                        case opcodes.ADD_REG_TO_REG:
                            destinationRegister = checkRegisterSP(memory.load(++self.ip));
                            sourceRegister = checkRegisterSP(memory.load(++self.ip));
                            setRegisterSP(destinationRegister,checkOperation(getRegisterSP(destinationRegister) + getRegisterSP(sourceRegister)));
                            self.ip++;
                            break;
                        case opcodes.ADD_REGADDRESS_TO_REG:
                            destinationRegister = checkRegisterSP(memory.load(++self.ip));
                            sourceRegister = memory.load(++self.ip);
                            setRegisterSP(destinationRegister,checkOperation(getRegisterSP(destinationRegister) + memory.load(indirectRegisterAddress(sourceRegister))));
                            self.ip++;
                            break;
                        case opcodes.ADD_ADDRESS_TO_REG:
                            destinationRegister = checkRegisterSP(memory.load(++self.ip));
                            sourceMemory = memory.load(++self.ip);
                            setRegisterSP(destinationRegister,checkOperation(getRegisterSP(destinationRegister) + memory.load(sourceMemory)));
                            self.ip++;
                            break;
                        case opcodes.ADD_NUMBER_TO_REG:
                            destinationRegister = checkRegisterSP(memory.load(++self.ip));
                            number = memory.load(++self.ip);
                            setRegisterSP(destinationRegister,checkOperation(getRegisterSP(destinationRegister) + number));
                            self.ip++;
                            break;
                        case opcodes.SUB_REG_FROM_REG:
                            destinationRegister = checkRegisterSP(memory.load(++self.ip));
                            sourceRegister = checkRegisterSP(memory.load(++self.ip));
                            setRegisterSP(destinationRegister,checkOperation(getRegisterSP(destinationRegister) - self.registers[sourceRegister]));
                            self.ip++;
                            break;
                        case opcodes.SUB_REGADDRESS_FROM_REG:
                            destinationRegister = checkRegisterSP(memory.load(++self.ip));
                            sourceRegister = memory.load(++self.ip);
                            setRegisterSP(destinationRegister,checkOperation(getRegisterSP(destinationRegister) - memory.load(indirectRegisterAddress(sourceRegister))));
                            self.ip++;
                            break;
                        case opcodes.SUB_ADDRESS_FROM_REG:
                            destinationRegister = checkRegisterSP(memory.load(++self.ip));
                            sourceMemory = memory.load(++self.ip);
                            setRegisterSP(destinationRegister,checkOperation(getRegisterSP(destinationRegister) - memory.load(sourceMemory)));
                            self.ip++;
                            break;
                        case opcodes.SUB_NUMBER_FROM_REG:
                            destinationRegister = checkRegisterSP(memory.load(++self.ip));
                            number = memory.load(++self.ip);
                            setRegisterSP(destinationRegister,checkOperation(getRegisterSP(destinationRegister) - number));
                            self.ip++;
                            break;
                        case opcodes.INC_REG:
                            destinationRegister = checkRegisterSP(memory.load(++self.ip));
                            setRegisterSP(destinationRegister,checkOperation(getRegisterSP(destinationRegister) + 1));
                            self.ip++;
                            break;
                        case opcodes.DEC_REG:
                            destinationRegister = checkRegisterSP(memory.load(++self.ip));
                            setRegisterSP(destinationRegister,checkOperation(getRegisterSP(destinationRegister) - 1));
                            self.ip++;
                            break;
                        case opcodes.CMP_REG_WITH_REG:
                            destinationRegister = checkRegisterSP(memory.load(++self.ip));
                            sourceRegister = checkRegisterSP(memory.load(++self.ip));
                            checkOperation(getRegisterSP(destinationRegister) - getRegisterSP(sourceRegister));
                            self.ip++;
                            break;
                        case opcodes.CMP_REGADDRESS_WITH_REG:
                            destinationRegister = checkRegisterSP(memory.load(++self.ip));
                            sourceRegister = memory.load(++self.ip);
                            checkOperation(getRegisterSP(destinationRegister) - memory.load(indirectRegisterAddress(sourceRegister)));
                            self.ip++;
                            break;
                        case opcodes.CMP_ADDRESS_WITH_REG:
                            destinationRegister = checkRegisterSP(memory.load(++self.ip));
                            sourceMemory = memory.load(++self.ip);
                            checkOperation(getRegisterSP(destinationRegister) - memory.load(sourceMemory));
                            self.ip++;
                            break;
                        case opcodes.CMP_NUMBER_WITH_REG:
                            destinationRegister = checkRegisterSP(memory.load(++self.ip));
                            number = memory.load(++self.ip);
                            checkOperation(getRegisterSP(destinationRegister) - number);
                            self.ip++;
                            break;
                        case opcodes.JMP_REGADDRESS:
                            destinationRegister = checkRegister(memory.load(++self.ip));
                            jump(self.registers[destinationRegister]);
                            break;
                        case opcodes.JMP_ADDRESS:
                            number = memory.load(++self.ip);
                            jump(number);
                            break;
                        case opcodes.JC_REGADDRESS:
                            destinationRegister = checkRegister(memory.load(++self.ip));
                            if (self.carry) jump(self.registers[destinationRegister]);
                            else self.ip++;
                            break;
                        case opcodes.JC_ADDRESS:
                            number = memory.load(++self.ip);
                            if (self.carry)jump(number);
                            else self.ip++;
                            break;
                        case opcodes.JNC_REGADDRESS:
                            destinationRegister = checkRegister(memory.load(++self.ip));
                            if (!self.carry)jump(self.registers[destinationRegister]);
                            else self.ip++;
                            break;
                        case opcodes.JNC_ADDRESS:
                            number = memory.load(++self.ip);
                            if (!self.carry)jump(number);
                            else self.ip++;
                            break;
                        case opcodes.JZ_REGADDRESS:
                            destinationRegister = checkRegister(memory.load(++self.ip));
                            if (self.zero) jump(self.registers[destinationRegister]);
                            else self.ip++;
                            break;
                        case opcodes.JZ_ADDRESS:
                            number = memory.load(++self.ip);
                            if (self.zero)jump(number);
                            else self.ip++;
                            break;
                        case opcodes.JNZ_REGADDRESS:
                            destinationRegister = checkRegister(memory.load(++self.ip));
                            if (!self.zero)jump(self.registers[destinationRegister]);
                            else self.ip++;
                            break;
                        case opcodes.JNZ_ADDRESS:
                            number = memory.load(++self.ip);
                            if (!self.zero) jump(number);
                            else self.ip++;
                            break;
                        case opcodes.JA_REGADDRESS:
                            destinationRegister = checkRegister(memory.load(++self.ip));
                            if (!self.zero && !self.carry)jump(self.registers[destinationRegister]);
                            else self.ip++;
                            break;
                        case opcodes.JA_ADDRESS:
                            number = memory.load(++self.ip);
                            if (!self.zero && !self.carry) jump(number);
                            else self.ip++;
                            break;
                        case opcodes.JNA_REGADDRESS:
                            destinationRegister = checkRegister(memory.load(++self.ip));
                            if (self.zero || self.carry)jump(self.registers[destinationRegister]);
                            else self.ip++;
                            break;
                        case opcodes.JNA_ADDRESS:
                            number = memory.load(++self.ip);
                            if (self.zero || self.carry)jump(number);
                            else self.ip++;
                            break;
                        case opcodes.PUSH_REG:
                            sourceRegister = checkRegister(memory.load(++self.ip));
                            push(self.registers[sourceRegister]);
                            self.ip++;
                            break;
                        case opcodes.PUSH_REGADDRESS:
                            sourceRegister = memory.load(++self.ip);
                            push(memory.load(indirectRegisterAddress(sourceRegister)));
                            self.ip++;
                            break;
                        case opcodes.PUSH_ADDRESS:
                            sourceMemory = memory.load(++self.ip);
                            push(memory.load(sourceMemory));
                            self.ip++;
                            break;
                        case opcodes.PUSH_NUMBER:
                            number = memory.load(++self.ip);
                            push(number);
                            self.ip++;
                            break;
                        case opcodes.POP_REG:
                            destinationRegister = checkRegister(memory.load(++self.ip));
                            self.registers[destinationRegister] = pop();
                            self.ip++;
                            break;
                        case opcodes.CALL_REGADDRESS:
                            destinationRegister = checkRegister(memory.load(++self.ip));
                            push(self.ip+1);
                            jump(self.registers[destinationRegister]);
                            break;
                        case opcodes.CALL_ADDRESS:
                            number = memory.load(++self.ip);
                            push(self.ip+1);
                            jump(number);
                            break;
                        case opcodes.RET:
                            jump(pop());
                            break;
                        case opcodes.MUL_REG:
                            sourceRegister = checkRegister(memory.load(++self.ip));
                            self.registers[0] = checkOperation(self.registers[0] * self.registers[sourceRegister]);
                            self.ip++;
                            break;
                        case opcodes.MUL_REGADDRESS:
                            sourceRegister = memory.load(++self.ip);
                            self.registers[0] = checkOperation(self.registers[0] * memory.load(indirectRegisterAddress(sourceRegister)));
                            self.ip++;
                            break;
                        case opcodes.MUL_ADDRESS:
                            sourceMemory = memory.load(++self.ip);
                            self.registers[0] = checkOperation(self.registers[0] * memory.load(sourceMemory));
                            self.ip++;
                            break;
                        case opcodes.MUL_NUMBER:
                            number = memory.load(++self.ip);
                            self.registers[0] = checkOperation(self.registers[0] * number);
                            self.ip++;
                            break;
                        case opcodes.DIV_REG:
                            sourceRegister = checkRegister(memory.load(++self.ip));
                            self.registers[0] = checkOperation(division(self.registers[sourceRegister]));
                            self.ip++;
                            break;
                        case opcodes.DIV_REGADDRESS:
                            sourceRegister = memory.load(++self.ip);
                            self.registers[0] = checkOperation(division(memory.load(indirectRegisterAddress(sourceRegister))));
                            self.ip++;
                            break;
                        case opcodes.DIV_ADDRESS:
                            sourceMemory = memory.load(++self.ip);
                            self.registers[0] = checkOperation(division(memory.load(sourceMemory)));
                            self.ip++;
                            break;
                        case opcodes.DIV_NUMBER:
                            number = memory.load(++self.ip);
                            self.registers[0] = checkOperation(division(number));
                            self.ip++;
                            break;
                        case opcodes.AND_REG_WITH_REG:
                            destinationRegister = checkRegister(memory.load(++self.ip));
                            sourceRegister = checkRegister(memory.load(++self.ip));
                            self.registers[destinationRegister] = checkOperation(self.registers[destinationRegister] & self.registers[sourceRegister]);
                            self.ip++;
                            break;
                        case opcodes.AND_REGADDRESS_WITH_REG:
                            destinationRegister = checkRegister(memory.load(++self.ip));
                            sourceRegister = memory.load(++self.ip);
                            self.registers[destinationRegister] = checkOperation(self.registers[destinationRegister] & memory.load(indirectRegisterAddress(sourceRegister)));
                            self.ip++;
                            break;
                        case opcodes.AND_ADDRESS_WITH_REG:
                            destinationRegister = checkRegister(memory.load(++self.ip));
                            sourceMemory = memory.load(++self.ip);
                            self.registers[destinationRegister] = checkOperation(self.registers[destinationRegister] & memory.load(sourceMemory));
                            self.ip++;
                            break;
                        case opcodes.AND_NUMBER_WITH_REG:
                            destinationRegister = checkRegister(memory.load(++self.ip));
                            number = memory.load(++self.ip);
                            self.registers[destinationRegister] = checkOperation(self.registers[destinationRegister] & number);
                            self.ip++;
                            break;
                        case opcodes.OR_REG_WITH_REG:
                            destinationRegister = checkRegister(memory.load(++self.ip));
                            sourceRegister = checkRegister(memory.load(++self.ip));
                            self.registers[destinationRegister] = checkOperation(self.registers[destinationRegister] | self.registers[sourceRegister]);
                            self.ip++;
                            break;
                        case opcodes.OR_REGADDRESS_WITH_REG:
                            destinationRegister = checkRegister(memory.load(++self.ip));
                            sourceRegister = memory.load(++self.ip);
                            self.registers[destinationRegister] = checkOperation(self.registers[destinationRegister] | memory.load(indirectRegisterAddress(sourceRegister)));
                            self.ip++;
                            break;
                        case opcodes.OR_ADDRESS_WITH_REG:
                            destinationRegister = checkRegister(memory.load(++self.ip));
                            sourceMemory = memory.load(++self.ip);
                            self.registers[destinationRegister] = checkOperation(self.registers[destinationRegister] | memory.load(sourceMemory));
                            self.ip++;
                            break;
                        case opcodes.OR_NUMBER_WITH_REG:
                            destinationRegister = checkRegister(memory.load(++self.ip));
                            number = memory.load(++self.ip);
                            self.registers[destinationRegister] = checkOperation(self.registers[destinationRegister] | number);
                            self.ip++;
                            break;
                        case opcodes.XOR_REG_WITH_REG:
                            destinationRegister = checkRegister(memory.load(++self.ip));
                            sourceRegister = checkRegister(memory.load(++self.ip));
                            self.registers[destinationRegister] = checkOperation(self.registers[destinationRegister] ^ self.registers[sourceRegister]);
                            self.ip++;
                            break;
                        case opcodes.XOR_REGADDRESS_WITH_REG:
                            destinationRegister = checkRegister(memory.load(++self.ip));
                            sourceRegister = memory.load(++self.ip);
                            self.registers[destinationRegister] = checkOperation(self.registers[destinationRegister] ^ memory.load(indirectRegisterAddress(sourceRegister)));
                            self.ip++;
                            break;
                        case opcodes.XOR_ADDRESS_WITH_REG:
                            destinationRegister = checkRegister(memory.load(++self.ip));
                            sourceMemory = memory.load(++self.ip);
                            self.registers[destinationRegister] = checkOperation(self.registers[destinationRegister] ^ memory.load(sourceMemory));
                            self.ip++;
                            break;
                        case opcodes.XOR_NUMBER_WITH_REG:
                            destinationRegister = checkRegister(memory.load(++self.ip));
                            number = memory.load(++self.ip);
                            self.registers[destinationRegister] = checkOperation(self.registers[destinationRegister] ^ number);
                            self.ip++;
                            break;
                        case opcodes.NOT_REG:
                            destinationRegister = checkRegister(memory.load(++self.ip));
                            self.registers[destinationRegister] = checkOperation(~self.registers[destinationRegister]);
                            self.ip++;
                            break;
                        case opcodes.SHL_REG_WITH_REG:
                            destinationRegister = checkRegister(memory.load(++self.ip));
                            sourceRegister = checkRegister(memory.load(++self.ip));
                            self.registers[destinationRegister] = checkOperation(self.registers[destinationRegister] << self.registers[sourceRegister]);
                            self.ip++;
                            break;
                        case opcodes.SHL_REGADDRESS_WITH_REG:
                            destinationRegister = checkRegister(memory.load(++self.ip));
                            sourceRegister = memory.load(++self.ip);
                            self.registers[destinationRegister] = checkOperation(self.registers[destinationRegister] << memory.load(indirectRegisterAddress(sourceRegister)));
                            self.ip++;
                            break;
                        case opcodes.SHL_ADDRESS_WITH_REG:
                            destinationRegister = checkRegister(memory.load(++self.ip));
                            sourceMemory = memory.load(++self.ip);
                            self.registers[destinationRegister] = checkOperation(self.registers[destinationRegister] << memory.load(sourceMemory));
                            self.ip++;
                            break;
                        case opcodes.SHL_NUMBER_WITH_REG:
                            destinationRegister = checkRegister(memory.load(++self.ip));
                            number = memory.load(++self.ip);
                            self.registers[destinationRegister] = checkOperation(self.registers[destinationRegister] << number);
                            self.ip++;
                            break;
                        case opcodes.SHR_REG_WITH_REG:
                            destinationRegister = checkRegister(memory.load(++self.ip));
                            sourceRegister = checkRegister(memory.load(++self.ip));
                            self.registers[destinationRegister] = checkOperation(self.registers[destinationRegister] >>> self.registers[sourceRegister]);
                            self.ip++;
                            break;
                        case opcodes.SHR_REGADDRESS_WITH_REG:
                            destinationRegister = checkRegister(memory.load(++self.ip));
                            sourceRegister = memory.load(++self.ip);
                            self.registers[destinationRegister] = checkOperation(self.registers[destinationRegister] >>> memory.load(indirectRegisterAddress(sourceRegister)));
                            self.ip++;
                            break;
                        case opcodes.SHR_ADDRESS_WITH_REG:
                            destinationRegister = checkRegister(memory.load(++self.ip));
                            sourceMemory = memory.load(++self.ip);
                            self.registers[destinationRegister] = checkOperation(self.registers[destinationRegister] >>> memory.load(sourceMemory));
                            self.ip++;
                            break;
                        case opcodes.SHR_NUMBER_WITH_REG:
                            destinationRegister = checkRegister(memory.load(++self.ip));
                            number = memory.load(++self.ip);
                            self.registers[destinationRegister] = checkOperation(self.registers[destinationRegister] >>> number);
                            self.ip++;
                            break;
                        default:
                            throw "Invalid op code: " + instruction;
                    }
                    return true
                }
                catch (e){
                    console.log("cpu catch",e)
                    self.fault = true;
                    throw e;
                }
            },
            reset: function(){
                var self = this

                self.registers = [0, 0, 0, 0]
                self.stackPointer= 231
                self.ip= 0
                self.zero= false
                self.carry= false
                self.fault= false
            }
        }
    })
    cpu.reset()
    return (
        <cpuContext.Provider value={[cpu,setCpu]}>
            {props.children}
        </cpuContext.Provider>
    );
}
export default CpuProvider;
