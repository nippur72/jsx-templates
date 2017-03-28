import { renderComponent as render } from "./makeInlineComponent";
import { defaultOptions } from "../utils/options";

describe("'is' attribute", ()=> {
   it("allows to set custom root tag", ()=>{          
      const template = `<Test is="span">Hello</Test>`;     
      const rendered = render(template);      
      const expected = `<span>Hello</span>`;
      expect(rendered).toEqual(expected);      
   });
});

