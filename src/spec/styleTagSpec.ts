import { renderComponent as render } from "./makeInlineComponent";
import { defaultOptions, CommandLineOptions } from "../utils/options";

import Rioct = require("rioct"); // for <style> rendering 

describe("'style' tag", ()=> {
   it("extracts styles in debug mode", ()=>{
      Rioct.updateStyles = function() {};
      Rioct.styles = [];
      const options: CommandLineOptions = { ...defaultOptions(), debugRuntimeCheck: true };
      const template = `<Test><style>div { color: red; } ._this_ { color: green; }</style><div class="_this_">Hello</div></Test>`;     
      const rendered = render(template, {}, options);      
      const expected = `<div><div class="_ce9a7594_">Hello</div></div>`;
      expect(rendered).toEqual(expected);      
      expect(Rioct.styles).toEqual(['/*** styles local to tag <nofile> ***/\r\n\r\ndiv { color: red; } ._ce9a7594_ { color: green; }']);
   });

   it("extracts and minifies in production mode", ()=>{
      Rioct.updateStyles = function() {};
      Rioct.styles = [];
      const options: CommandLineOptions = { ...defaultOptions(), debugRuntimeCheck: false };
      const template = `<Test><style>div { color: red; } ._this_ { color: green; }</style><div class="_this_">Hello</div></Test>`;     
      const rendered = render(template, {}, options);      
      const expected = `<div><div class="_ce9a7594_">Hello</div></div>`;
      expect(rendered).toEqual(expected);      
      expect(Rioct.styles).toEqual(['div{color:red}._ce9a7594_{color:green}']);
   });
});
