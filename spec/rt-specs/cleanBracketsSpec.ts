import { cleanBrackets, Brackets } from "../../brackets";

const customBrackets: Brackets = {
   open: "{{",
   close: "}}"
};

const normalBrackets: Brackets = {
   open: "{",
   close: "}"
};

describe("cleanBrackets()" , ()=> {
   it("strips out optional brackets",()=>{      
      expect(cleanBrackets("{{he{{ll}}o}}", customBrackets)).toEqual("he{{ll}}o");   
      expect(cleanBrackets("{{}}", customBrackets)).toEqual("");   
      expect(cleanBrackets("{{", customBrackets)).toEqual("{{");   
      expect(cleanBrackets("hello", customBrackets)).toEqual("hello");   
      expect(cleanBrackets("", customBrackets)).toEqual("");   
   });
});

