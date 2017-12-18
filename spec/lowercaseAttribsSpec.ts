import { renderComponent as render } from "./makeInlineComponent";
import { defaultOptions } from "../utils/options";

describe("lowercase attribute names", ()=> {
   it("are translated to camelcase if supported by react", ()=>{          
      const template = `
         <Test>
            <div tabindex="-1" />
         </Test>`;     
      const rendered = render(template);      
      const expected = `<div><div tabindex="-1"></div></div>`;
      expect(rendered).toEqual(expected);      
   });
});


