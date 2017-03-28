import { renderComponent as render } from "./makeInlineComponent";
import { defaultOptions } from "../utils/options";

describe("simple component", ()=> {
   it("works", ()=>{          
      const template = `<Test>Hello</Test>`;     
      const rendered = render(template);      
      const expected = `<div>Hello</div>`;
      expect(rendered).toEqual(expected);      
   });
});
