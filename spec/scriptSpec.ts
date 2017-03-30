import { renderComponent as render } from "./makeInlineComponent";
import { defaultOptions } from "../utils/options";

describe("'script' tag", ()=> {
   it("injects code on before the render function", ()=>{      
      const template = `
         <Test>
            <script>
               const somevar = "John";
            </script>
            <div>Hello {{somevar}}</div>
         </Test>`;     
      const rendered = render(template);      
      const expected = `<div><div>Hello John</div></div>`;
      expect(rendered).toEqual(expected);
   });
});
