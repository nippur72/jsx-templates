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

   it("expands the '_this_' prefix", ()=>{          
      const template = `<Test><div className="_this_">Hi</div></Test>`;     
      const rendered = render(template);      
      const expected = `<div><div class="_ce9a7594_">Hi</div></div>`;
      expect(rendered).toEqual(expected);      
   });

   it("accepts the alternate object syntax", ()=>{          
      const template = `<Test><div class="{{ { border: true, highlight: false, raised: true } }}">Hi</div></Test>`;     
      const rendered = render(template);      
      const expected = `<div><div class="border raised">Hi</div></div>`;
      expect(rendered).toEqual(expected);      
   });
});
