import './index.scss';
import osjs from 'osjs';
import {name as applicationName} from './metadata.json';
import React from 'react';
import ReactDOM from 'react-dom';
import App from './src/App';

// Our launcher
const register = (core, args, options, metadata) => {
  // Create a new Application instance
  const proc = core.make('osjs/application', {args, options, metadata});

  // Create  a new Window instance
  proc.createWindow({
    id: 'Window',
    title: "x86 Assembler",
    dimension: {width: 1000, height: 800},
    position: {left: 600, top: 100}
  })
    .on('destroy', () => proc.destroy())
    .render(($content, win) =>
      ReactDOM.render(React.createElement(App, {core, proc, win}), $content));

  return proc;
};

// Creates the internal callback function when OS.js launches an application
osjs.register(applicationName, register);
