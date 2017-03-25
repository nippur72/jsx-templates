import { astNode, rootNode, virtualNode, tagNode } from "../nodeTypes";
import { Keywords } from "../astNode";
import { replaceNode } from "./replaceNode";

export function transform_if(node: astNode)
{   
   if(node.type === "tag")
   {
      let ifAttrib = node.attribs[Keywords.if];      
      if(ifAttrib !== undefined) 
      {         
         let condition = ifAttrib;         
         delete node.attribs[Keywords.if];

         let parentnode = node.parent;

         // prepares a virtual node
         let ifNode: virtualNode = 
         {
            type: "virtual",
            expression: `{${ifAttrib}?%%%children%%%:null}`,
            children: [ node ],
            parent: parentnode 
         };

         if(parentnode === null || parentnode === undefined) {
            throw `${Keywords.if} can't be placed in a root node`;
         }

         replaceNode(parentnode as tagNode, node, ifNode);
      }
   }
   
   if(node.type === "tag" || node.type === "virtual" || node.type === "root")
   {  
      node.children.forEach(n=>transform_if(n));
   }
}

