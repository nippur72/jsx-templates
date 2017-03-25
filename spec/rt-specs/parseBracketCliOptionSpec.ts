import { parseBracketCliOption, Brackets } from "../../brackets";

describe("parseBracketCliOption()" , ()=> {
   it("parses brackets from command line option",()=>{
      expect(parseBracketCliOption("{{ }}")).toEqual({ open: "{{", close: "}}"} as Brackets);   
      expect(parseBracketCliOption("{ }")).toEqual({ open: "{", close: "}"} as Brackets);   
      expect(()=>parseBracketCliOption("{}")).toThrow();
   });
});

