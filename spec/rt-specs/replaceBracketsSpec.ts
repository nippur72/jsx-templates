import { Context } from "../../context";
import { replaceBrackets, Brackets } from "../../brackets";
import { defaultOptions } from "../../options";

const customBrackets = <Context> {
   brackets: { open: "{{", close: "}}" } as Brackets,
   options: defaultOptions()
} 

const defaultBrackets = <Context> {
   brackets: { open: "{", close: "}" } as Brackets,
   options: defaultOptions()
} 

describe("replaceBrackets" , ()=> {
   describe("with custom brackets", ()=> {
      it("parses expressions",()=>{

         let s = replaceBrackets("{{hello}}", customBrackets);
         expect(s).toEqual("{hello}");
   
         s = replaceBrackets("aaaaa{{hello}}bbbbb", customBrackets);
         expect(s).toEqual("aaaaa{hello}bbbbb");

         s = replaceBrackets("aaaaa{{hello}}", customBrackets);
         expect(s).toEqual("aaaaa{hello}");

         s = replaceBrackets("{{hello}}bbbbb", customBrackets);
         expect(s).toEqual("{hello}bbbbb");

         s = replaceBrackets("a{{hello}}b{{some}}c", customBrackets);
         expect(s).toEqual("a{hello}b{some}c");

         s = replaceBrackets("text", customBrackets);
         expect(s).toEqual("text");

         s = replaceBrackets("", customBrackets);
         expect(s).toEqual("");

         expect(()=>replaceBrackets("{{", customBrackets)).toThrow();
      });

      it("throws error on excesss closed brackets",()=>{
         expect(()=>replaceBrackets("{{ hello }} }}", customBrackets)).toThrow();      
      });

      it("throws error on nested brackets",()=>{
         expect(()=>replaceBrackets("{{ {{ hello }} }}", customBrackets)).toThrow();      
      });
   });

   describe("with default brackets", ()=> {
      it("parses expressions",()=>{

         let s = replaceBrackets("{hello}", defaultBrackets);
         expect(s).toEqual("{hello}");
   
         s = replaceBrackets("aaaaa{hello}bbbbb", defaultBrackets);
         expect(s).toEqual("aaaaa{hello}bbbbb");

         s = replaceBrackets("aaaaa{hello}", defaultBrackets);
         expect(s).toEqual("aaaaa{hello}");

         s = replaceBrackets("{hello}bbbbb", defaultBrackets);
         expect(s).toEqual("{hello}bbbbb");

         s = replaceBrackets("a{hello}b{some}c", defaultBrackets);
         expect(s).toEqual("a{hello}b{some}c");

         s = replaceBrackets("text", defaultBrackets);
         expect(s).toEqual("text");

         s = replaceBrackets("", defaultBrackets);
         expect(s).toEqual("");

         expect(()=>replaceBrackets("{", defaultBrackets)).toThrow();
      });

      // TODO: document this different behavior than custom brackets
      it("does not throw error on excesss closed brackets",()=>{
         expect(replaceBrackets("{ hello } }", customBrackets)).toEqual("{ hello } }");
      });

      // TODO: document this different behavior than custom brackets
      it("does not throw error on nested brackets",()=>{
         expect(replaceBrackets("{ { hello } }", customBrackets)).toEqual("{ { hello } }");
      });
   });
});

