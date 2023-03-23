import { renderComponent as render } from "./makeInlineComponent";
import { defaultOptions } from "../utils/options";

xdescribe("empty attributes", ()=> {

   // TODO this specs needs to be improved

   it("are translated to true to emulate HTML standard", ()=>{          
      const template = `
         <Test>
            <script>
               const SomeComponent = (props) => React.createElement('div', props, props.hello);
            </script>
            <SomeComponent hello></SomeComponent>
         </Test>`;     
      const rendered = render(template);      
      const expected = `<div><div>true</div>`;
      expect(rendered).toEqual(expected);      
   });
});

