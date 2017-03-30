import { renderComponent as render } from "./makeInlineComponent";
import { defaultOptions } from "../utils/options";

describe("lowercase attribute names", ()=> {
   it("are translated to camelcase if supported by react", ()=>{          
      const template = `
         <Test>
            <input maxlength={{2}} />
         </Test>`;     
      const rendered = render(template);      
      const expected = `<div><input maxlength="2"/></div>`;
      expect(rendered).toEqual(expected);      
   });
});


