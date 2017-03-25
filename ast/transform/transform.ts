import { rootNode } from "../nodeTypes";

import { transform_is } from "./is";
import { transform_each } from "./each";
import { transform_if } from "./if";
import { transform_scope } from "./scope";

export function transform(ast: rootNode)
{
   transform_is(ast);
   transform_each(ast);
   transform_if(ast);     // TODO else, switch
   transform_scope(ast);
   // brackets attribs
   // brackets text
   // props
   // class
   // <virtual>
   // <script>
   // <import>
   // <export>
   // ?? <include> 
   // rt-pre
   // style
   // stateless
   // event handlers, binding?
   // template as props
   // template functions
   // modules output?
   // normalize whitespace
   // helper functions, mergeprops
   // debug
   // typescript
   // jsx/typescript output
   // error with line, column   
   // keyword redefinition
   // plugins
}

