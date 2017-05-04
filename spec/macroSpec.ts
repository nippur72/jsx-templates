import { renderComponent as render } from "./makeInlineComponent";
import { defaultOptions } from "../utils/options";

describe("'macro' tag", ()=> {
   it("allow to define macro component", ()=>{          
      const template = `
         <Test stateless export="require">
            <ul><MyItem></MyItem></ul>
         </Test>
         <macro name="MyItem">
            <li>hello</li>
         </macro>`;     
      const rendered = render(template);      
      const expected = `<div><ul><li>hello</li></ul></div>`;
      expect(rendered).toEqual(expected);      
   });

   // TODO works with if, scope, etc.
   it("works with if", ()=>{          
      const template = `
         <Test stateless export="require">
            <ul if="{{true}}"><MyItem></MyItem></ul>
            <ul if="{{false}}"><MyItem></MyItem></ul>
            <ul><MyItem if="{{false}}"></MyItem></ul>
         </Test>
         <macro name="MyItem">
            <li>hello</li>
         </macro>`;     
      const rendered = render(template);      
      const expected = `<div><ul><li>hello</li></ul><ul></ul></div>`;
      expect(rendered).toEqual(expected);      
   });

   // macro def must have single direct child

   // macro instance cannot contain children

   // macro def cannot have attributes
});
