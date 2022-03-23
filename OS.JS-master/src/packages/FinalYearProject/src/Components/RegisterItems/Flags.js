import React,{useContext} from 'react';
import {cpuContext} from "../../Providers/CPUProvider";
import "./register.css"

function Flags(props) {

    const [cpu,setCpu] = useContext(cpuContext)

    return (
        <div className="flag-box">
            <div className="flag-title">FLAGS</div>
            <div className="flag-names">
                <div className="flag-containers" >
                    <div className="flag-carry">C</div>
                    <div id="flag-carry" >F</div>
                </div>
                <div className="flag-containers">
                    <div className="flag-zero">Z</div>
                    <div id="flag-zero">F</div>
                </div>
                <div className="flag-containers">
                    <div className="flag-fault">F</div>
                    <div id="flag-fault">F</div>
                </div>
                <div className="flag-containers">
                    <div className="flag-ip">IP</div>
                    <div  id="flag-ip" >0</div>
                </div>
                <div  className="flag-containers">
                    <div className="flag-sp">SP</div>
                    <div id="flag-sp">231</div>
                </div>
            </div>
        </div>
    );
}

export default Flags;
