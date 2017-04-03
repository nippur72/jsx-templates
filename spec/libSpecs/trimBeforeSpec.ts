import { trimBefore, trimAfter } from "../../utils/trim";

describe("trimBefore()", ()=> {
   it("trims spaces between two tags", ()=>{          
      expect(trimBefore("   ")).toEqual("   ");      
      expect(trimBefore("  \r\n qualia")).toEqual("qualia");            
      expect(trimBefore("  \r\n   ")).toEqual("");      
   });
});

describe("trimAfter()", ()=> {
   it("trims spaces between two tags", ()=>{          
      expect(trimAfter("   ")).toEqual("   ");      
      expect(trimAfter("qualia   \r\n   ")).toEqual("qualia");            
      expect(trimAfter("  \r\n   ")).toEqual("");      
   });
});
