import { renderComponent as render } from "./makeInlineComponent";
import { defaultOptions } from "../utils/options";

describe("'scope' attribute", ()=> {
   it("works", ()=>{          
      const template = `<Test><div scope="42 as fortytwo; ' is the answer' as ans">{fortytwo}{ans}</Test>`;     
      const rendered = render(template);      
      const expected = `<div><div>42 is the answer</div></div>`;
      expect(rendered).toEqual(expected);      
   });

   it("allows 'as' typescript expression", ()=>{          
      const template = `<Test><div scope="(42 as number) as fortytwo">{fortytwo}</Test>`;     
      const rendered = render(template);      
      const expected = `<div><div>42</div></div>`;
      expect(rendered).toEqual(expected);      
   });

   it("is expanded before 'if' and 'each'", ()=>{          
      const template = `<Test><div scope="{{42 as fortytwo}}" if="{{fortytwo==42}}">yes!</div></Test>`;     
      const rendered = render(template);      
      const expected = `<div><div>yes!</div></div>`;
      expect(rendered).toEqual(expected);      
   });
});
