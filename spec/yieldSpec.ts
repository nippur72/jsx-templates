﻿import { renderComponent as render } from "./makeInlineComponent";
import { defaultOptions } from "../utils/options";

describe("'yield' tag", ()=> {
   it("works with stateless components", ()=>{          
      const template = `
         <Test stateless export="require">
            Hello, <yield>
         </Test>`;     
      const rendered = render(template, { children: [ "Mr.", "John"] });      
      const expected = `<div>Hello, Mr.John</div>`;
      expect(rendered).toEqual(expected);      
   });

   xit("works with stateful components", ()=>{          
      const template = `
         <Test>
            Hello, <yield>
         </Test>`;     
      const rendered = render(template, { children: [ "Mr.", "John"] });      
      const expected = `<div>Hello, Mr.John</div>`;
      expect(rendered).toEqual(expected);      
   });
});
