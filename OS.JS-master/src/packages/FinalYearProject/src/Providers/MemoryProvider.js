/*
software modified from https://github.com/Schweigi/assembler-simulator provided by MIT licence
 */
import React, { useState, createContext, useEffect} from 'react';

export const memoryContext = createContext()

function MemoryProvider(props) {
    const [memory,setMemory] = useState(()=>{
        return{
            data: Array(256),
            lastAccess: -1,
            load: function(address) {
                var self = this
                if(address < 0 || address >255) throw "Memory access violation at "+address;
                self.lastAccess = address
                return self.data[address]
            },
            store: function(address,value){
                var self = this
                if(address < 0 || address >255) throw "Memory access violation at "+address;
                self.lastAccess = address
                return self.data[address] = value
            },
            reset: function(){
                var self = this
                for(let i = 0; i <self.data.length; i++) self.data[i] = 0
                self.lastAccess = -1
            }
        }
    })

    useEffect(()=>{
        memory.reset()
    },[])

    return (
        <memoryContext.Provider value={[memory,setMemory]}>
            {props.children}
        </memoryContext.Provider>
    );
}

export default MemoryProvider;
