import { astNode, rootNode, codeNode, tagNode } from "../nodeTypes";
import { Keywords } from "../keywords";
import { splitBrackets, removeOptionalBrackets } from "../../utils/brackets";

let optional_brackets_attributes = 
[
   Keywords.each,
   Keywords.if,
   Keywords.scope,
   //Keywords.classobj
   // TODO add other special attributes
];

// TODO custom brackets
const brackets = { open: "{{", close: "}}" };

export function transform_optional_brackets(node: astNode)
{  
   if(node.type === "tag")
   {
      optional_brackets_attributes.forEach(key => {
         if(node.attribs[key]) {
            node.attribs[key].rawText = removeOptionalBrackets(node.attribs[key].rawText, brackets);
         }
      });
   }
   
   if(node.type === "tag" || node.type === "code" || node.type === "root")
   {  
      node.children.forEach(n => transform_optional_brackets(n));
   }  
}
