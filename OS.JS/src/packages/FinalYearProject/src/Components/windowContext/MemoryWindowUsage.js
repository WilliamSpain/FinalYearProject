import React, { useContext } from "react";
import { WindowContext } from "./WindowContext";
import ReactDOM from 'react-dom';
import MemoryContainer from '../Layout/MemoryContainer/MemoryContainer.js';

const MemoryWindowUsage = () => {
  const { core, proc } = useContext(WindowContext);
  const procSecond = proc;

  //alert window
  /*  const onClickOpen = () => {
    core.make("osjs/dialog", "alert", { message: "text" }, () => {
    });
  };*/

  const onClickSecond = () => {
    procSecond.createWindow({
      id: 'secondWindow',
      title: 'Memory',
      dimension: {width: 600, height: 400},
      position: {left: 100, top: 500}
    }).on('destroy', () => {secondWindow.destroy();})
      .render(($content) => ReactDOM.render(React.createElement(MemoryContainer), $content));
  };

  return (
      <button onClick={onClickSecond}>MEMORY</button>
  );
};

export default MemoryWindowUsage;
