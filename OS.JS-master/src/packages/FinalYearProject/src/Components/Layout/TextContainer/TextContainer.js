import React, {useEffect, useContext} from "react";
import AceEditor from "react-ace";
import "ace-builds/src-noconflict/mode-assembly_x86";
import "ace-builds/src-noconflict/theme-github";
import './textContainer.css';
import CpuProvider, {cpuContext,cpuReset} from "../../../Providers/CPUProvider";
import {assemblerContext} from "../../../Providers/AssemblerProvider";


function onChange(newValue) {
    //console.log("change", newValue);
}

const TextContainer = () => {
    const [cpu,setCPU] = useContext(cpuContext)
    const assembler = useContext(assemblerContext)
    return (
            <AceEditor
                mode="assembly_x86"
                theme="github"
                onChange={onChange}
                wrapEnabled={true}
                width= "100%"
                height="100%"
                indentedSoftWrap={false}
                showPrintMargin={false}
                setOptions={{
                    printMarginColumn: 86,
                    indentedSoftWrap: false,
                    tabSize: 4,
                    fontSize: "11pt",
                }}
                editorProps={{
                    $blockScrolling: true,

                }}
            />
    );
}
export default TextContainer;
