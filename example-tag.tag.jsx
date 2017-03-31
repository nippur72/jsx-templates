import React = require("react");
import Rioct = require("rioct");
Rioct.styles.push("/*** styles local to tag <Test> ***/\r\n\r\n\r\n     .someclass\r\n     {\r\n        color: red;   \r\n     }\r\n   "); Rioct.updateStyles();

let _$e0_ = (() => {
   try {
      var $expr = (55);
      if(typeof $expr === 'undefined') {
         console.error("runtime error when evaluating: 55\nin file: '..\\???', line ???, col ???\nexpression must be not be undefined, instead is '"+(typeof $expr)+"'");
      }
      return $expr;
   }
   catch(ex) {
      console.error("runtime error when evaluating: 55\nin file: '..\\???', line ???, col ???\n" + ex.message);
      return undefined;
   }
});
function render(this: any) { return (<div><div someprop={_$e0_()}>hello</div></div>); }
export = render;