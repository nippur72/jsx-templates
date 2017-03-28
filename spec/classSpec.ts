import { renderComponent as render } from "./makeInlineComponent";
import { defaultOptions } from "../utils/options";

describe("'class' attribute", ()=> {
   it("works alone", ()=>{          
      const template = `<Test><div class="hello">Hi</div></Test>`;     
      const rendered = render(template);      
      const expected = `<div><div class="hello">Hi</div></div>`;
      expect(rendered).toEqual(expected);      
   });

   it("works with className", ()=>{          
      const template = `<Test><div class="hello" className="me">Hi</div></Test>`;     
      const rendered = render(template);      
      const expected = `<div><div class="hello me">Hi</div></div>`;
      expect(rendered).toEqual(expected);      
   });

   it("works with only className", ()=>{          
      const template = `<Test><div className="me">Hi</div></Test>`;     
      const rendered = render(template);      
      const expected = `<div><div class="me">Hi</div></div>`;
      expect(rendered).toEqual(expected);      
   });
});
