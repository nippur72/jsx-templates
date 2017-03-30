import { renderComponent as render } from "./makeInlineComponent";
import { defaultOptions } from "../utils/options";

describe("'yield' tag", ()=> {
   it("works with stateless components", ()=>{          
      const template = `
         <Test stateless>
            Hello, <yield>
         </Test>`;     
      const rendered = render(template, { children: [ "Mr.", "John"] });      
      const expected = `<div>Hello, Mr.John</div>`;
      expect(rendered).toEqual(expected);      
   });
});
