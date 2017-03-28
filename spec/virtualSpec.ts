import { renderComponent as render } from "./makeInlineComponent";
import { defaultOptions } from "../utils/options";

describe("'virtual' tag", ()=> {
   it("works with multiple content", ()=>{          
      const template = `<Test><virtual><div>1</div><div>2</div></virtual></Test>`;     
      const rendered = render(template);      
      const expected = `<div><div>1</div><div>2</div></div>`;
      expect(rendered).toEqual(expected);      
   });

   it("works with empty content", ()=>{          
      const template = `<Test><virtual></virtual></Test>`;     
      const rendered = render(template);      
      const expected = `<div></div>`;
      expect(rendered).toEqual(expected);      
   });

   it("works with special attributes", ()=>{          
      const template = `
         <Test>
            <virtual if="true">yes<span>all</span></virtual>            
            <virtual each="x in [1,2,3]">{{x}}</virtual>
            <virtual scope="42 as fortytwo">{{fortytwo}}</virtual>
            <div>
               <virtual if="true" each="x in [1,2,3]" scope="42 as fortytwo">{{fortytwo}}{{x}}</virtual>
            </div>
         </Test>
      `;     
      const rendered = render(template);      
      const expected = `<div>yes<span>all</span>12342<div>421422423</div></div>`;
      expect(rendered).toEqual(expected);         
   });

   it("works with nestedspecial attributes", ()=>{          
      const template = `
         <Test>
            <virtual if="true">
               <virtual scope="42 as fortytwo">
                  <virtual each="x in [1,2,3]">{{fortytwo}}-{{x}},</virtual>
               </virtual>
            </virtual>
         </Test>
      `;     
      const rendered = render(template);      
      const expected = `<div>42-1,42-2,42-3,</div>`;
      expect(rendered).toEqual(expected);         
   });
});
