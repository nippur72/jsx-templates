import { parseScope, scopeItem } from "../../parseScope";

describe("parseScope()", ()=> {
   function test(scope: string, expected: scopeItem[]) {
      const r = parseScope(scope);
      expect(r).toEqual(expected);
   }

   function noway(scope: string, error?: string) {
      const r = () => parseScope(scope);
      if(error) expect(r).toThrow(error);
      else      expect(r).toThrow();
   }
   
   it("parses simple scope not ending in semicolon", ()=> {
      test("a as b", [{ expression: "a", identifier: "b"}]);
   });

   it("parses simple scope ending in semicolon", ()=> {
      test("a as b;", [{ expression: "a", identifier: "b"}]);
   });

   it("parses multiple scopes not ending in semicolon", ()=> {
      test("aaa as bbb;ccc as ddd;eee as fff", [
         { expression: "aaa", identifier: "bbb"},
         { expression: "ccc", identifier: "ddd"},
         { expression: "eee", identifier: "fff"},
      ]);
   });

   it("parses multiple scopes ending in semicolon", ()=> {
      test("aaa as bbb;ccc as ddd;eee as fff;", [
         { expression: "aaa", identifier: "bbb"},
         { expression: "ccc", identifier: "ddd"},
         { expression: "eee", identifier: "fff"},
      ]);
   });

   it("parses complex expression", ()=> {
      test("(function answer(){return 42;})() as question", [{ expression: "(function answer(){return 42;})()", identifier: "question"}]);
      test("3 + 4 * 8 as a", [{ expression: "3 + 4 * 8", identifier: "a"}]);
   });

   it("parses complex id", ()=> {
      test("a as _$123z", [{ expression: "a", identifier: "_$123z"}]);
      test("a as _", [{ expression: "a", identifier: "_"}]);
      test("a as $", [{ expression: "a", identifier: "$"}]);
      test("a as A", [{ expression: "a", identifier: "A"}]);
   });

   it("parses quoted strings", ()=> {
      test(`"a as id;" as id;`, [{ expression: `"a as id;"`, identifier: "id"}]);
      test(`'a as id;' as id;`, [{ expression: `'a as id;'`, identifier: "id"}]);
      test(`"\\"a as id;" as id;`, [{ expression: `"\\"a as id;"`, identifier: "id"}]);
      test(`'\\'a as id;' as id;`, [{ expression: `'\\'a as id;'`, identifier: "id"}]);
   });

   it("parses previously critical expressions", ()=> {
      test("'as fast as possible' as message", [{ expression: "'as fast as possible'", identifier: "message"}]);
      test("';' as semicolon",  [{ expression: "';'", identifier: "semicolon"}]);
      test(" as as as1 ", [{ expression: "as", identifier: "as1"}]);
      test("'as' as as", [{ expression: "'as'", identifier: "as"}]);
   });

   it("parses trailing spaces", ()=> {
      test(" a  as  b ; c as d ", [
         { expression: "a", identifier: "b"},
         { expression: "c", identifier: "d"},
      ]);
   });

   it("doesn't parse malformed id", ()=> {
      noway("a as 12b");
      noway("a as 12b;");
      noway("a as <b>");
      noway("a as 'b'");
   });

   it("doesn't parse malformed expressions", ()=> {
      noway("a as" );
      noway("a as;");
      noway("as a" );
      noway("as a;");
   });       
                                          
   it("doesn't parse multiple malformed expressions", ()=> {      
      noway("", "");      
      noway("a as id;;", ";");      
      noway("as id;", "as id;");      
      noway("a;", "a;");      
      noway("a as b;c", "c");      
      noway("a as b;c as d; e as", "e as");      
      noway("a as b;cas d; e as", "cas d; e as");      
      noway("a as 12;", "a as 12;");      
      noway("x'a as v", "x'a as v");      
      noway("a as id;x'a as v", "x'a as v");      
      noway('x"a as v', 'x"a as v');      
      noway('a as id;x"a as v', 'x"a as v');      
   });     
});
