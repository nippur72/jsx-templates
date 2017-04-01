import { renderComponent as render } from "./makeInlineComponent";
import { defaultOptions } from "../utils/options";

describe("'stateless' attribute", ()=> {
   it("makes a stateless react component", ()=>{          
      const template = `<Test stateless>Hello {{props.name}}</Test>`;     
      const rendered = render(template, {name: "Nino"});      
      const expected = `<div>Hello Nino</div>`;
      expect(rendered).toEqual(expected);      
   });

   it("allow to pass props type", ()=>{          
      const template = `<Test stateless="{name: string}">Hello {{props.name}}</Test>`;     
      const rendered = render(template, {name: "Nino"});      
      const expected = `<div>Hello Nino</div>`;
      expect(rendered).toEqual(expected);      
   });
});
