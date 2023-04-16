import { renderComponent as render } from "./makeInlineComponent";
import { defaultOptions, CommandLineOptions } from "../utils/options";

import Rioct = require("rioct"); // for <style> rendering 

function updateStyles(st?: string) {
   if(st !== undefined) Rioct.styles.push(st);   
}

describe("'style' tag", ()=> {
   it("extracts and minifies styles", ()=>{
      Rioct.updateStyles = updateStyles;
      Rioct.styles = [];
      const options: CommandLineOptions = { ...defaultOptions() };
      const template = `<Test><style>div { color: red; } ._this_ { color: green; }</style><div class="_this_">Hello</div></Test>`;     
      const rendered = render(template, {}, options);      
      const expected = `<div><div class="_ce9a7594_">Hello</div></div>`;
      expect(rendered).toEqual(expected);      
      expect(Rioct.styles).toEqual(['div{color:red}._ce9a7594_{color:green}']);
   });
});
