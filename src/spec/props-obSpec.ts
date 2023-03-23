import { renderComponent as render } from "./makeInlineComponent";
import { defaultOptions } from "../utils/options";

describe("'props' attribute", ()=> {
   it("allows passing a composite object as props", ()=>{          
      const template = `<Test><div props="{{ {className: 'hello' } }}">Hi</div></Test>`;     
      const rendered = render(template);      
      const expected = `<div><div class="hello">Hi</div></div>`;
      expect(rendered).toEqual(expected);      
   });
});
