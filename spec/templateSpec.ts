import { renderComponent as render } from "./makeInlineComponent";
import { defaultOptions } from "../utils/options";

describe("'scope' attribute", ()=> {
   it("works", ()=>{          
      const template = `
         <Test stateless>
            <div>
               Hello
               <template name="But1">
                  <span>1</span>
               </template>
               <template name="But2" props="{d: string}">
                  <span>-{props.d}-</span>
               </template>
               <But1></But1>
               <But2 d="2"></But2>         
            </div>
         </Test>`;     
      const rendered = render(template);      
      const expected = `<div><div>Hello<span>1</span><span>-2-</span></div></div>`;
      expect(rendered).toEqual(expected);      
   });
});
