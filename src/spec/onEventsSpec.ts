import { renderComponent as render } from "./makeInlineComponent";
import { defaultOptions } from "../utils/options";

describe("'on' events", ()=> {
   it("are translated to camelcase if supported by react", ()=>{          
      const template = `
         <Test>
            <div scope="{{function f(){} as func}}">
               <button onclick="{{func}}"></button>
            </div>
         </Test>`;     
      const rendered = render(template);      
      const expected = `<div><div><button></button></div></div>`;
      expect(rendered).toEqual(expected);      
   });
});
