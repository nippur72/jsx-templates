import { renderComponent as render } from "./makeInlineComponent";
import { defaultOptions } from "../utils/options";

describe("'if' attribute", ()=> {
   it("works with nested content", ()=>{          
      const template = `<Test><div if="true">true<span>for real</span></div><div if="false">false<span>for real</span></div></Test>`;     
      const rendered = render(template);      
      const expected = `<div><div>true<span>for real</span></div></div>`;
      expect(rendered).toEqual(expected);      
   });

   it("works with nested ifs", ()=>{          
      const template = `
         <Test>
            <div if="true">
               <span if="true">true</span>
            </div>
            <div if="true">
               <span if="false">false</span>
            </div>
         </Test>`;     
      const rendered = render(template);      
      const expected = `<div><div><span>true</span></div><div></div></div>`;
      expect(rendered).toEqual(expected);      
   });
});
