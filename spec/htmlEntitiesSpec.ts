import { renderComponent as render } from "./makeInlineComponent";
import { defaultOptions } from "../utils/options";

describe("html entities in text", ()=> {
   it("are translated", ()=>{          
      const template = `<Test>Hello&nbsp;World&lt;&gt;</Test>`;     
      const rendered = render(template);      
      const expected = `<div>Hello\xA0World&lt;&gt;</div>`;
      expect(rendered).toEqual(expected);      
   });
});

