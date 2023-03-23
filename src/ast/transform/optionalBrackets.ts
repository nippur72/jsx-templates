import { astNode, rootNode, tagNode, visit } from "../nodeTypes";
import { Keywords } from "../keywords";
import { splitBrackets, removeOptionalBrackets } from "../../utils/brackets";
import { getRootNode } from "../astNode";

let optional_brackets_attributes = 
[
   Keywords.each,
   Keywords.if,
   Keywords.scope,
   //Keywords.classobj
   // TODO add other special attributes
];

export function transform_optional_brackets(node: astNode)
{  
   let root = getRootNode(node);
   transform_optional_brackets_inner(node, root);
}

export function transform_optional_brackets_inner(node: astNode, root: rootNode)
{  
   if(node.type === "tag")
   {
      optional_brackets_attributes.forEach(key => {
         if(node.attribs[key]) {
            node.attribs[key].rawText = removeOptionalBrackets(node.attribs[key].rawText, root.brackets);
         }
      });
   }
   
   visit(node, (n)=>transform_optional_brackets_inner(n, root));
}
