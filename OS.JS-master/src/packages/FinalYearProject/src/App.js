import React, {useState,useContext,useMemo} from 'react';
import Navbar from './Components/Layout/MainNavBar/Navbar';
import TextContainer from './Components/Layout/TextContainer/TextContainer';
import {WindowContext} from './Components/windowContext/WindowContext';
import './app.css';
import CpuProvider from "./Providers/CPUProvider";
import MemoryProvider from "./Providers/MemoryProvider";
import OpCodeProvider from "./Providers/OPCodeProvider";
import AssemblerProvider from "./Providers/AssemblerProvider";

function App ({ core, proc, win }) {
    return(
        <OpCodeProvider>
            <MemoryProvider>
                <CpuProvider>
                    <AssemblerProvider>
                        <WindowContext.Provider value={{core, proc, win }}>
                            <div className="main-content">
                                <div className="navbar-region">
                                    <Navbar  />
                                </div>
                                <div className="text-region">
                                    <TextContainer />
                                </div>
                            </div>
                        </WindowContext.Provider>
                    </AssemblerProvider>
                </CpuProvider>
            </MemoryProvider>
        </OpCodeProvider>
    );
};
export default App;
