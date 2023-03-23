import { renderComponent as render } from "./makeInlineComponent";
import { defaultOptions } from "../utils/options";

xdescribe("show/hide attribute", ()=> {
   it("use styles to display the tag", ()=>{          
      const template = `<Test stateless><div show="{{true}}">Hello</div></Test>`;     
      const rendered = render(template);      
      const expected = `<div><div>Hello</div></div>`;
      expect(rendered).toEqual(expected);      
   });

   it("use styles to hide the tag", ()=>{          
      const template = `<Test stateless><div show="{{false}}">Hello</div></Test>`;     
      const rendered = render(template);      
      const expected = `<div><div style="display: none">Hello</div></div>`;
      expect(rendered).toEqual(expected);      
   });

   it("use styles to display the tag", ()=>{          
      const template = `<Test stateless><div hide="{{false}}">Hello</div></Test>`;     
      const rendered = render(template);      
      const expected = `<div><div>Hello</div></div>`;
      expect(rendered).toEqual(expected);      
   });

   it("uses styles to display the tag", ()=>{          
      const template = `<Test stateless><div hide="{{true}}">Hello</div></Test>`;     
      const rendered = render(template);      
      const expected = `<div><div style="display: none">Hello</div></div>`;
      expect(rendered).toEqual(expected);      
   });

   // TODO spec show and hide on the same tag

   it("mixes with existing styles", ()=>{          
      const template = `
         <Test stateless>
            <div style="color: red" show="{{true}}">1</div>
            <div style="color: red" show="{{false}}">2</div>
            <div style="color: red" hide="{{true}}">3</div>            
            <div style="color: red" hide="{{false}}">4</div>
         </Test>`;     
      const rendered = render(template);
      
      const expected = [ '<div>',
                            '<div style="color:red;">1</div>',
                            '<div style="color:red; display: none">2</div>',
                            '<div style="color:red; display: none">3</div>',
                            '<div style="color:red;">4</div>',
                         '</div>' ].join();

      expect(rendered).toEqual(expected);      
   });

});
