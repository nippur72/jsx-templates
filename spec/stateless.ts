import { renderComponent as render } from "./makeInlineComponent";
import { defaultOptions } from "../utils/options";

describe("simple stateless component", ()=> {
   it("works", ()=>{          
      const template = `<Test stateless>Hello {{props.name}}</Test>`;     
      const rendered = render(template, {name: "Nino"});      
      const expected = `<div>Hello Nino</div>`;
      expect(rendered).toEqual(expected);      
   });
});
