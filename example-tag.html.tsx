import React = require("react");

function render(this: any) { return ((()=>{let a=42; return (<div>{a==20?<div>twenty</div>:<div>"three"</div>}</div>);})()); }
export = render;