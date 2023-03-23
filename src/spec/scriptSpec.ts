import { renderComponent as render } from "./makeInlineComponent";
import { defaultOptions } from "../utils/options";

describe("'script' tag", ()=> {
   it("injects code on before the render function", ()=>{      
      const template = `
         <script>
            const somevar = { name: "John" };
         </script>
         <Test>
            <div>Hello {{somevar.name}}</div>
         </Test>`;     
      const rendered = render(template);      
      const expected = `<div><div>Hello John</div></div>`;
      expect(rendered).toEqual(expected);
   });

   it("puts code in scope", ()=>{      
      const template = `
         <Test>
            <div>
               <script>
                  const somevar = "John";
               </script>
               <div>Hello {{somevar}}</div>
            </div>
            <div>
               <script>
                  const somevar = "Tom";
               </script>
               <div>Hello {{somevar}}</div>
            </div>            
         </Test>`;     
      const rendered = render(template);      
      const expected = `<div><div><div>Hello John</div></div><div><div>Hello Tom</div></div></div>`;
      expect(rendered).toEqual(expected);
   });

   it("puts code in scope under the root tag", ()=>{      
      const template = `
         <Test>
            <script>
               const somevar = "John";
            </script>
            Hello {{somevar}}
         </Test>`;     
      const rendered = render(template);      
      const expected = `<div>Hello John</div>`;
      expect(rendered).toEqual(expected);
   });
});
