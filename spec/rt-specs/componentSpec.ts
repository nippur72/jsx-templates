import { renderComponent as render } from "./makeInlineComponent";
import { defaultOptions } from "../../options";

describe("stateless attribute", ()=> {
   it("works correctly", ()=>{          
      const template = "<test stateless>Hello {props.name}</test>";
      const props = {name: "Nino"};
      const rendered = render(template, props);      
      const expected = "<div>Hello Nino</div>";
      expect(rendered).toEqual(expected);      
   });

   xit("can be placed only on the root node", ()=>{

   });
});


describe("custom brackets", ()=> {
   it("is rendered correctly", ()=>{        
      let options = defaultOptions();          
      options.brackets = "{% %}";

      const rendered = render("<test stateless><span>Hello {% props.name %}</span></test>", {name: "Nino"}, options);      
      const expected = "<div><span>Hello Nino</span></div>";
      expect(rendered).toEqual(expected);      
   });
});
          

describe("default brackets", ()=> {
   it("is rendered correctly", ()=>{          
      const template = "<test stateless>Hello {props.name}</test>";
      const props = {name: "Nino"};
      const rendered = render(template, props);      
      const expected = "<div>Hello Nino</div>";
      expect(rendered).toEqual(expected);      
   });
});

describe("CLI option --normalize-html-whitespace", ()=> {
   it("does trim spaces when turned on", ()=>{          
      const template = "<test stateless>\n    Hello   \n   {props.name}    </test>";
      const props = {name: "Nino"};
      const rendered = render(template, props);      
      const expected = "<div> Hello Nino </div>";
      expect(rendered).toEqual(expected);      
   });

   it("does not trim when turned off", ()=>{          
      const options = defaultOptions(); 
      options.normalizeHtmlWhitespace = false;
      const template = "<test stateless>\n    Hello   \n   {props.name}    </test>";
      const props = {name: "Nino"};
      const rendered = render(template, props, options);      
      const expected = "<div>\n    Hello   \n   Nino    </div>";
      expect(rendered).toEqual(expected);      
   });
});

describe("scope attribute", ()=> {
   it("works correctly", ()=>{          
      const template = '<test stateless><virtual scope="props.name as name">Hello {name}</virtual></test>';
      const props = {name: "Nino"};
      const rendered = render(template, props);      
      const expected = "<div>Hello Nino</div>";
      expect(rendered).toEqual(expected);      
   });
});

describe("naming convention", ()=> {
   it("allows tag name to be redefined with 'is'", ()=>{          
      const template = `<ExampleTag is="ex-tag">Hello</ExampleTag>`;      
      const rendered = render(template);      
      const expected = `<ex-tag>Hello</ex-tag>`;
      expect(rendered).toEqual(expected);      
   });

   it("forbids kebab-cased names in tag definition", ()=>{          
      const template = `<example-tag>Hello</example-tag>`;      
      const rendered = ()=>render(template);
      expect(rendered).toThrow("invalid tag name 'example-tag' for definition");      
   });
});

describe("yield", ()=> {
   it("yields in a stateless component", ()=>{          
      const template = "<test stateless><yield /></test>";      
      const props = {children: "this was yield"};
      const rendered = render(template, props);      
      const expected = "<div>this was yield</div>";
      expect(rendered).toEqual(expected);      
   });

   xit("yields in a stateful component", ()=>{          
      const template = "<test><yield /></test>";      
      const props = {children: "Nino"};
      const rendered = render(template, props);      
      const expected = "<div>Nino</div>";
      expect(rendered).toEqual(expected);      
   });
});
