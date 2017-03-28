import { renderComponent as render } from "./makeInlineComponent";
import { defaultOptions } from "../utils/options";

describe("'scope' attribute", ()=> {
   it("works", ()=>{          
      const template = `<Test"><div scope="42 as fortytwo; ' is the answer' as ans">{fortytwo}{ans}</Test>`;     
      const rendered = render(template);      
      const expected = `<div><div>42 is the answer</div></div>`;
      expect(rendered).toEqual(expected);      
   });
});
