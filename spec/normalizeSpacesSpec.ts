import { renderComponent as render } from "./makeInlineComponent";
import { defaultOptions, CommandLineOptions } from "../utils/options";

xdescribe("--normalize-html-whitespace", ()=> {
   it("removes repeating whitespaces", ()=>{          
      const template = `<Test>  Hello   my  \t  name  is   \r\n   Peter   </Test>`;     
      const rendered = render(template);      
      const expected = `<div> Hello my name is Peter </div>`;
      expect(rendered).toEqual(expected);      
   });
});

describe("trailing whitespaces", ()=> {
   it("are not removed when enclosing tags are on the same line", ()=>{          
      const options: CommandLineOptions = { ...defaultOptions(), normalizeHtmlWhitespace: false };
      const template = `<Test>  Hello  </Test>`;     
      const rendered = render(template, {}, options);      
      const expected = `<div>  Hello  </div>`;
      expect(rendered).toEqual(expected);      
   });

   it("are removed when enclosing tags are on different lines", ()=>{          
      const options: CommandLineOptions = { ...defaultOptions(), normalizeHtmlWhitespace: false };
      const template = `<Test>  
                           Hello  
                        </Test>`;     
      const rendered = render(template, {}, options);      
      const expected = `<div>Hello</div>`;
      expect(rendered).toEqual(expected);      
   });
});
