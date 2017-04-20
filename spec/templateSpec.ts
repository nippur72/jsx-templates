import { renderComponent as render } from "./makeInlineComponent";
import { defaultOptions } from "../utils/options";

describe("'template' tag", ()=> {
   it("allow to define local stateless component", ()=>{          
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

   it("works with scope", ()=>{          
      const template = `
         <Test stateless>
            <div scope="{{42 as fortytwo}}">               
               <template name="But1">
                  <span>Hello {{fortytwo}}</span>
               </template>
               <But1></But1>
            </div>
         </Test>`;     
      const rendered = render(template);      
      const expected = `<div><div><span>Hello 42</span></div></div>`;
      expect(rendered).toEqual(expected);      
   });

   it("does not allow non simple direct child node", ()=>{          
      const template = `
         <Test stateless>
            <div>               
               <template name="But1">
                  <span scope="{{42 as b}}">Hello {{b}}</span>
               </template>
               <But1></But1>
            </div>
         </Test>`;     
      const rendered = ()=>render(template);      
      const expected = `<div><div><span>Hello 42</span></div></div>`;
      expect(rendered).toThrow();      
   });
});
