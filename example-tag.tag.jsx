import React = require("react");
import Rioct = require("rioct");
Rioct.styles.push("/*** styles local to tag <a tag (TODO)> ***/\r\n\r\n\r\n     .someclass\r\n     {\r\n        color: red;   \r\n     }\r\n   "); Rioct.updateStyles();
function render() { return (<div><div>hello</div></div>); }
export = render;