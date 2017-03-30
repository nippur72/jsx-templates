import { renderComponent as render } from "./makeInlineComponent";
import { defaultOptions } from "../utils/options";

describe("'import' tag", ()=> {
   it("works", ()=>{          
      const template = `
         <Test>
            <import name="t1"         from="./spec/importSpec"></import> 
            <import name="t1" as="t2" from="./spec/importSpec"></import> 
            <import all as="t3"       from="./spec/importSpec"></import> 
            <import default="t4"      from="./spec/importSpec"></import> 
            <import require="t5"      from="./spec/importSpec"></import>
            <div>{{t1}}</div>
            <div>{{t2}}</div>
            <div>{{t3.t1}}</div>
            <div>{{t4}}</div>
            <div>{{t5.t1}}</div>
         </Test>`;     
      const rendered = render(template);      
      const expected = `<div><div>test1</div><div>test1</div><div>test1</div><div>test2</div><div>test1</div></div>`;
      expect(rendered).toEqual(expected);      
   });
});

// TODO <import require="component" from="ending.html"> 

// needed for the spec
export const t1 = "test1";
const tdef = "test2";
export default tdef;



