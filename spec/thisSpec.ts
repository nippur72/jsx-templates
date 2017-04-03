import { renderComponent as render } from "./makeInlineComponent";
import { defaultOptions } from "../utils/options";

describe("'this' attribute", ()=> {
   it("works", ()=>{          
      const template = `<Test this="thisSpec">{{this.hello().a}}</Test>`;     
      const rendered = render(template);      
      const expected = `<div>42</div>`;
      expect(rendered).toEqual(  expected);      
   });
});


import React = require("react");

export class ThisComponent extends React.Component<any,any>
{
   hello()
   {
      return {a: 42};
   }
}
