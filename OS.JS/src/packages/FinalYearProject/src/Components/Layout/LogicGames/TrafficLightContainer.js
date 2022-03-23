import React from 'react';
import "./trafficLight.css"

const TrafficLightContainer = () => {
    return (
            <div className="traffic-container">
                <svg className="traffic-svg" viewBox="150 0 800 600" width="800" height="600" xmlns="http://www.w3.org/2000/svg">
                    <g>
                        <title>Layer 1</title>
                        <rect width="100%" height="100%" fill="#56b6ed"/>
                        <rect fill="#191919" stroke="#000" x="275" y="50" width="250" height="500" id="svg_1"/>
                        <ellipse fill="#a9a9a9" stroke="#000" cx="400" cy="300" id="traffic-orange" rx="70" ry="70"/>
                        <ellipse fill="#a9a9a9" stroke="#000" cx="400" cy="150" id="traffic-red" rx="70" ry="70"/>
                        <ellipse fill="#a9a9a9" stroke="#000" cx="400" cy="450" id="traffic-green" rx="70" ry="70"/>
                        <rect fill="#7f7f7f" stroke="#000" x="347" y="550" width="106" height="50" id="svg_6"/>
                        <rect id="svg_9" height="70" width="70" y="20" x="730" stroke="#000" fill="#ffffff"/>
                        <rect id="svg_12" height="70" width="70" y="90" x="730" stroke="#000" fill="#ffffff"/>
                        <rect id="svg_13" height="70" width="70" y="160" x="730" stroke="#000" fill="#ffffff"/>
                        <rect id="svg_14" height="70" width="70" y="230" x="730" stroke="#000" fill="#ffffff"/>
                        <rect id="svg_15" height="70" width="70" y="300" x="730" stroke="#000" fill="#ffffff"/>
                        <rect id="svg_16" height="70" width="70" y="370" x="730" stroke="#000" fill="#ffffff"/>
                        <rect id="svg_17" height="70" width="70" y="440" x="730" stroke="#000" fill="#ffffff"/>
                        <rect id="svg_18" height="70" width="70" y="510" x="730" stroke="#000" fill="#ffffff"/>
                        <text fontStyle="normal" fontWeight="normal" space="preserve" textAnchor="start" fontFamily="inherit" fontSize="70" id="tl-bit-7" y="80" x="745" stroke="#000" fill="#000000">0</text>
                        <text fontStyle="normal" fontWeight="normal" space="preserve" textAnchor="start" fontFamily="inherit" fontSize="70" id="tl-bit-6" y="150" x="745" stroke="#000" fill="#000000">0</text>
                        <text fontStyle="normal" fontWeight="normal" space="preserve" textAnchor="start" fontFamily="inherit" fontSize="70" id="tl-bit-5" y="220" x="745" stroke="#000" fill="#000000">0</text>
                        <text fontStyle="normal" fontWeight="normal" space="preserve" textAnchor="start" fontFamily="inherit" fontSize="70" id="tl-bit-4" y="290" x="745" stroke="#000" fill="#000000">0</text>
                        <text fontStyle="normal" fontWeight="normal" space="preserve" textAnchor="start" fontFamily="inherit" fontSize="70" id="tl-bit-3" y="360" x="745" stroke="#000" fill="#000000">0</text>
                        <text fontStyle="normal" fontWeight="normal" space="preserve" textAnchor="start" fontFamily="inherit" fontSize="70" id="tl-bit-2" y="430" x="745" stroke="#000" fill="#000000">0</text>
                        <text fontStyle="normal" fontWeight="normal" space="preserve" textAnchor="start" fontFamily="inherit" fontSize="70" id="tl-bit-1" y="500" x="745" stroke="#000" fill="#000000">0</text>
                        <text fontStyle="normal" fontWeight="normal" space="preserve" textAnchor="start" fontFamily="inherit" fontSize="70" id="tl-bit-0" y="570" x="745" stroke="#000" fill="#000000">0</text>
                        <line id="svg_29" y2="55" x2="650" y1="55" x1="730" strokeWidth="5" stroke="#191919" />
                        <line id="svg_30" y2="123" x2="653" y1="53" x1="653" strokeWidth="5" stroke="#191919" />
                        <line id="svg_31" y2="125" x2="514" y1="125" x1="729" strokeWidth="5" stroke="#191919" />
                        <line id="svg_33" y2="197" x2="653" y1="197" x1="730" strokeWidth="5" stroke="#191919" />
                        <line id="svg_34" y2="265" x2="653" y1="195" x1="653" strokeWidth="5" stroke="#191919" />
                        <line id="svg_35" y2="267" x2="514" y1="268" x1="729" strokeWidth="5" stroke="#191919" />
                        <line id="svg_36" y2="335" x2="653" y1="335" x1="730" strokeWidth="5" stroke="#191919" />
                        <line id="svg_37" y2="403" x2="653" y1="333" x1="653" strokeWidth="5" stroke="#191919" />
                        <line id="svg_38" y2="405" x2="515" y1="406" x1="729" strokeWidth="5" stroke="#191919"/>
                        <line id="svg_39" y2="475" x2="653" y1="475" x1="730" strokeWidth="5" stroke="white" />
                        <line id="svg_40" y2="543" x2="653" y1="473" x1="653" strokeWidth="5" stroke="white"/>
                        <line id="svg_41" y2="545" x2="597" y1="545" x1="730" strokeWidth="5" stroke="white"/>
                        <line id="svg_42" y2="122.2" x2="599" y1="547" x1="599" strokeWidth="5" stroke="white" />
                    </g>
                </svg>
            </div>
    );
};



export default TrafficLightContainer;
