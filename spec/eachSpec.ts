import { renderComponent as render } from "./makeInlineComponent";
import { defaultOptions } from "../utils/options";

describe("'each' attribute", ()=> {
   it("loops over array", ()=>{          
      const template = `<Test"><div each="el,i in [1,2,3]">{el} at {i}</div></Test>`;     
      const rendered = render(template);      
      const expected = `<div><div>1 at 0</div><div>2 at 1</div><div>3 at 2</div></div>`;
      expect(rendered).toEqual(expected);      
   });
});
