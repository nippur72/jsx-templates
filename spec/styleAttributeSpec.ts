import { renderComponent as render } from "./makeInlineComponent";
import { defaultOptions } from "../utils/options";

describe("style attribute", ()=> {
   it("works with simple constant strings", ()=>{          
      const template = `<Test stateless><div style="color: red;">Hello</div></Test>`;     
      const rendered = render(template);      
      const expected = `<div><div style="color:red;">Hello</div></div>`;
      expect(rendered).toEqual(expected);      
   });

   it("works with string expressions", ()=>{          
      const template = `<Test stateless scope="{{'red' as c}}"><div style="color: {{c}};">Hello</div></Test>`;     
      const rendered = render(template);      
      const expected = `<div><div style="color:red;">Hello</div></div>`;
      expect(rendered).toEqual(expected);      
   });

   it("does not allow bracketed expressions in style keys", ()=>{          
      const template = `<Test stateless scope="{{'lo' as lo}}"><div style="co{{lo}}r: red;">Hello</div></Test>`;     
      const rendered = ()=>render(template);            
      expect(rendered).toThrow('style attribute keys cannot contain { } expressions');
   });
});
