import { renderComponent as render } from "./makeInlineComponent";
import { defaultOptions } from "../utils/options";

describe("'if' attribute", ()=> {
   it("works with nested content", ()=>{          
      const template = `<Test><div if="true">true<span>for real</span></div><div if="false">false<span>for real</span></div></Test>`;     
      const rendered = render(template);      
      const expected = `<div><div>true<span>for real</span></div></div>`;
      expect(rendered).toEqual(expected);      
   });

   it("works with nested ifs", ()=>{          
      const template = `
         <Test>
            <div if="true">
               <span if="true">true</span>
            </div>
            <div if="true">
               <span if="false">false</span>
            </div>
         </Test>`;     
      const rendered = render(template);      
      const expected = `<div><div><span>true</span></div><div></div></div>`;
      expect(rendered).toEqual(expected);      
   });

   it("works with else clause", ()=>{          
      const template = `
         <Test>
            <div if="{{false}}">
               <span if="{{true}}">true</span>
            </div>
            <div else>
               <span if="{{true}}">42</span>
            </div>
         </Test>`;     
      const rendered = render(template);      
      const expected = `<div><div><span>42</span></div></div>`;
      expect(rendered).toEqual(expected);      
   });

   xit("works with else if clause", ()=>{          
      const template = `
         <Test scope="{{42 as a}}">
            <div if="{{a==20}}">
               twenty
            </div>
            <div else if="{{a==3}}">
               three
            </div>
            <div else if="{{a==42}}">
               fortytwo
            </div>
            <div else>
               never
            </div>
         </Test>`;     
      const rendered = render(template);      
      const expected = `<div><div>fortytwo</div></div>`;
      expect(rendered).toEqual(expected);      
   });

   it("forbids dangling else clause", ()=>{          
      const template = `
         <Test>
            <div if="{{false}}">
               <span if="{{true}}">true</span>
            </div>
            <div>hello</div>
            <div else>
               <span if="{{true}}">42</span>
            </div>
         </Test>`;     
      const rendered = ()=>render(template);            
      expect(rendered).toThrow();      
   });
});