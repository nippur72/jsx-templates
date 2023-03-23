import { renderComponent as render } from "./makeInlineComponent";
import { defaultOptions } from "../utils/options";

describe("brackets in attribute", ()=> {
   it("works when no brackets are specified", ()=>{          
      const template = `<Test data-a="some" data-b>Hello</Test>`;     
      const rendered = render(template);      
      const expected = `<div data-a="some" data-b="true">Hello</div>`;
      expect(rendered).toEqual(expected);      
   });

   it("expands a curly brace expression", ()=>{          
      const template = `<Test data-a="some{{1>0?'data':''}}" data-b="{{'some'}}data" data-c="som{{'e'+'d'}}a{{'t'}}a">Hello</Test>`;     
      const rendered = render(template);      
      const expected = `<div data-a="somedata" data-b="somedata" data-c="somedata">Hello</div>`;
      expect(rendered).toEqual(expected);      
   });

   it("throws if malformed expressions", ()=>{          
      const template1 = `<Test data-a="some{{data">Hello</Test>`;     
      const template2 = `<Test data-a="some}}data">Hello</Test>`;     
      const rendered1 = ()=>render(template1);            
      const rendered2 = ()=>render(template2);            
      expect(rendered1).toThrow('Failed to replace brackets in some{{data');
      expect(rendered2).toThrow('Failed to replace brackets in some}}data');
   });
});

describe("brackets in special attributes", ()=> {
   it("are removed because they are optional", ()=>{          
      const template = `
         <Test>
            <div if="{{true}}">1</div>
            <div each="{{a in [2,3]}}">{{a}}</div>
            <div scope="{{4 as four}}">{{four}}</div>
         </Test>
      `;     
      const rendered = render(template);      
      const expected = `<div><div>1</div><div>2</div><div>3</div><div>4</div></div>`;
      expect(rendered).toEqual(expected);      
   });

   it("are not necessare because they are optional", ()=>{          
      const template = `
         <Test>
            <div if="true">1</div>
            <div each="a in [2,3]">{{a}}</div>
            <div scope="4 as four">{{four}}</div>
         </Test>
      `;     
      const rendered = render(template);      
      const expected = `<div><div>1</div><div>2</div><div>3</div><div>4</div></div>`;
      expect(rendered).toEqual(expected);      
   });
});


describe("brackets in text", ()=> {
   it("works when no brackets are specified", ()=>{          
      const template = `<Test>some text</Test>`;     
      const rendered = render(template);      
      const expected = `<div>some text</div>`;
      expect(rendered).toEqual(expected);      
   });

   it("expands a curly brace expression", ()=>{          
      const template = `
         <Test>
            <div>some{{'data'}}</div>
            <div>{{'some'}}data</div>
            <div>som{{'e'+'d'}}a{{'t'}}a</div>
            <div>the answer is {{41+1}}.</div>
         </Test>`;     
      const rendered = render(template);      
      const expected = `<div><div>somedata</div><div>somedata</div><div>somedata</div><div>the answer is 42.</div></div>`;
      expect(rendered).toEqual(expected);      
   });

   it("throws if malformed expressions", ()=>{          
      const template1 = `<Test>some{{data</Test>`;     
      const template2 = `<Test>some}}data</Test>`;     
      const rendered1 = ()=>render(template1);            
      const rendered2 = ()=>render(template2);            
      expect(rendered1).toThrow('Failed to replace brackets in some{{data');
      expect(rendered2).toThrow('Failed to replace brackets in some}}data');
   });
});

// TODO do not allow brackets in special attributes
