﻿import { renderComponent as render } from "./makeInlineComponent";
import { defaultOptions, CommandLineOptions } from "../utils/options";

let grabbed_console = "";
let grab_console_function = (msg)=>{ grabbed_console=msg; };

describe("runtime check on attributes", ()=> {
   it("checks that attribute expressions are not undefined at runtime", ()=>{ 
      let options: CommandLineOptions = { 
         ...defaultOptions(), 
         debugRuntimeCheck: true,
         debugRuntimePrintFunction: "props.log"
      };     

      grabbed_console = "";
      
      const template = `
         <Test stateless>
            <div data-some="{{props.a}}"></div>
         </Test>`;     
      const props = { log: grab_console_function };      
      const rendered = render(template, props, options);
      const expected = [
         "runtime error when evaluating: props.a", 
         "in file: '..\\???', line ???, col ???", 
         "expression must be not be undefined, instead is 'undefined'" ];
      expect(grabbed_console.split("\n")).toEqual(expected);  
      expect(rendered).toEqual('<div><div></div></div>');
   });

   it("allows attribute expressions to be null at runtime", ()=>{ 
      let options: CommandLineOptions = { 
         ...defaultOptions(), 
         debugRuntimeCheck: true,
         debugRuntimePrintFunction: "props.log"
      };     

      grabbed_console = "";
      
      const template = `
         <Test stateless>
            <div data-some="{{props.a}}"></div>
         </Test>`;     
      const props = { log: grab_console_function, a: null };      
      const rendered = render(template, props, options);
      expect(grabbed_console).toEqual("");  
      expect(rendered).toEqual('<div><div></div></div>');
   });

   it("checks that attribute expressions do not throw at runtime", ()=>{ 
      let options: CommandLineOptions = { 
         ...defaultOptions(), 
         debugRuntimeCheck: true,
         debugRuntimePrintFunction: "props.log"
      };     
      
      grabbed_console = "";

      const template = `
         <Test stateless>
            <div data-some="{{(()=>throw 'argh')()}}"></div>
         </Test>`;     
      const props = { log: grab_console_function };
      const rendered = render(template, props, options);
      const expected = [
         "runtime error when evaluating: (()=>throw 'argh')()", 
         "in file: '..\\???', line ???, col ???", 
         "argh" ];
      expect(grabbed_console.split("\n")).toEqual(expected); 
      expect(rendered).toEqual('<div><div></div></div>');
   });
});


describe("runtime check on text", ()=> {
   it("checks that text expressions are not undefined at runtime", ()=>{ 
      let options: CommandLineOptions = { 
         ...defaultOptions(), 
         debugRuntimeCheck: true,
         debugRuntimePrintFunction: "props.log"
      };     

      grabbed_console = "";
      
      const template = `
         <Test stateless>
            {{props.a}}
         </Test>`;     
      const props = { log: grab_console_function };      
      const rendered = render(template, props, options);
      const expected = [
         "runtime error when evaluating: props.a", 
         "in file: '..\\???', line ???, col ???", 
         "expression must be of type 'string' or 'number', instead is 'undefined'" ];
      expect(grabbed_console.split("\n")).toEqual(expected); 
      expect(rendered).toEqual("<div></div>");
   });

   it("checks that text expressions are not an object at runtime", ()=>{ 
      let options: CommandLineOptions = { 
         ...defaultOptions(), 
         debugRuntimeCheck: true,
         debugRuntimePrintFunction: "props.log"
      };     

      grabbed_console = "";
      
      const template = `
         <Test stateless>
            {{props.a}}
         </Test>`;     
      const props = { log: grab_console_function, a: [ "hello" ] };      
      const rendered = render(template, props, options);
      const expected = [
         "runtime error when evaluating: props.a", 
         "in file: '..\\???', line ???, col ???", 
         "expression must be of type 'string' or 'number', instead is 'object'" ];
      expect(grabbed_console.split("\n")).toEqual(expected);
      expect(rendered).toEqual("<div>hello</div>");
   });

   it("allow text expressions to be null at runtime", ()=>{ 
      let options: CommandLineOptions = { 
         ...defaultOptions(), 
         debugRuntimeCheck: true,
         debugRuntimePrintFunction: "props.log"
      };     

      grabbed_console = "";
      
      const template = `
         <Test stateless>
            {{props.a}}
         </Test>`;     
      const props = { log: grab_console_function, a: null };      
      const rendered = render(template, props, options);
      expect(grabbed_console).toEqual("");      
      expect(rendered).toEqual("<div></div>");
   });

   it("checks that text expressions do not throw at runtime", ()=>{ 
      let options: CommandLineOptions = { 
         ...defaultOptions(), 
         debugRuntimeCheck: true,
         debugRuntimePrintFunction: "props.log"
      };     
      
      grabbed_console = "";

      const template = `
         <Test stateless>
            {{(()=>throw 'argh')()}}
         </Test>`;     
      const props = { log: grab_console_function };
      const rendered = render(template, props, options);
      const expected = [
         "runtime error when evaluating: (()=>throw 'argh')()", 
         "in file: '..\\???', line ???, col ???", 
         "argh" ];
      expect(grabbed_console.split("\n")).toEqual(expected); 
      expect(rendered).toEqual("<div>???</div>");
   });
});

xdescribe("runtime check on render function", ()=> {

   // TODO this spec needs to be improved

   it("checks that render function does not throw at runtime", ()=>{ 
      let options: CommandLineOptions = { 
         ...defaultOptions(), 
         debugRuntimeCheck: true,
         debugRuntimePrintFunction: "props.log"
      };     
      
      const template = `
         <Test stateless scope="{{ function(){throw 'a'} as Unknown }}">
            <Unknown></Unknown>
         </Test>`;     
      const props = { log: grab_console_function };
      const rendered = ()=>render(template, props, options, true);
      expect(rendered).toThrow();       
   });
});
                                