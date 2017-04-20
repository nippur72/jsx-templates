import React = require("react");

const render = (props: any, context) => (<div>{(()=>{let fortytwo=42; return ((()=>{let But1 = (props)=>(<span>Hello {fortytwo}</span>); return (<div><But1></But1></div>);})());})()}</div>);
export = render;