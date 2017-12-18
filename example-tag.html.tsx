import React = require("react");
// this is put under global
   const a = 1;



function render(this: any) { return ((()=>{// this is put under tag
         const b = 2; return (<div>Hello<input maxLength="2"></input></div>);})()); }
export = render;
function UnAltro(this: any) { return ((()=>{let f2=42; return (<div>Zompa</div>);})()); }
