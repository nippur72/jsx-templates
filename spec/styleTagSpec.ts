import { renderComponent as render } from "./makeInlineComponent";
import { defaultOptions } from "../utils/options";

import Rioct = require("rioct"); // for <style> rendering 

describe("'style' tag", ()=> {
   it("works", ()=>{
      Rioct.updateStyles = function() {};
      const template = `<Test><style>div { color: red; } ._this_ { color: green; }</style><div class="_this_">Hello</div></Test>`;     
      const rendered = render(template);      
      const expected = `<div><div class="_ce9a7594f10ab7f5fc0b7eaa74049b18_">Hello</div></div>`;
      expect(rendered).toEqual(expected);      
      expect(Rioct.styles).toEqual(['/*** styles local to tag <Test> ***/\r\n\r\ndiv { color: red; } ._ce9a7594f10ab7f5fc0b7eaa74049b18_ { color: green; }']);
   });
});
