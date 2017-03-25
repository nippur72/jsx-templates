import { renderComponent as render } from "./makeInlineComponent";
import { defaultOptions } from "../../options";
import { Keywords } from "../../ast/astNode";

describe("simple component", ()=> {
   it("works", ()=>{          
      const template = `<Test>Hello</Test>`;     
      const rendered = render(template);      
      const expected = `<div>Hello</div>`;
      expect(rendered).toEqual(expected);      
   });
});

describe("simple component with props", ()=> {
   it("works", ()=>{          
      const template = `<Test>Hello {props.name}</Test>`;     
      const rendered = render(template, {name: "Nino"});      
      const expected = `<div>Hello Nino</div>`;
      expect(rendered).toEqual(expected);      
   });
});

describe("'is' attribute", ()=> {
   it("allows to set custom root tag", ()=>{          
      const template = `<Test is="span">Hello</Test>`;     
      const rendered = render(template);      
      const expected = `<span>Hello</span>`;
      expect(rendered).toEqual(expected);      
   });
});

describe("'each' attribute", ()=> {
   it("loops over array", ()=>{          
      const template = `<Test"><div each="el,i in [1,2,3]">{el} at {i}</div></Test>`;     
      const rendered = render(template);      
      const expected = `<div><div>1 at 0</div><div>2 at 1</div><div>3 at 2</div></div>`;
      expect(rendered).toEqual(expected);      
   });
});

describe("'if' attribute", ()=> {
   it("works", ()=>{          
      const template = `<Test"><div if="true">true</div><div if="false">false</div></Test>`;     
      const rendered = render(template);      
      const expected = `<div><div>true</div></div>`;
      expect(rendered).toEqual(expected);      
   });
});

describe("'scope' attribute", ()=> {
   it("works", ()=>{          
      const template = `<Test"><div scope="42 as fortytwo; ' is the answer' as ans">{fortytwo}{ans}</Test>`;     
      const rendered = render(template);      
      const expected = `<div><div>42 is the answer</div></div>`;
      expect(rendered).toEqual(expected);      
   });
});
