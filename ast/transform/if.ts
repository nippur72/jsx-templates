import { astNode, rootNode, codeNode, tagNode } from "../nodeTypes";
import { Keywords } from "../keywords";
import { replaceNode } from "./replaceNode";
import { assignDummyKey } from "./dummyKey";

export function transform_if(node: astNode)
{   
   if(node.type === "tag")
   {
      let ifAttrib = node.attribs[Keywords.if];      
      if(ifAttrib !== undefined) 
      {         
         let condition = ifAttrib.rawText;         
         delete node.attribs[Keywords.if];

         let parentnode = node.parent;

         if(parentnode === null || parentnode === undefined) {
            throw `${Keywords.if} can't be placed in a root node`;
         }

         // prepares a code node
         let ifNode: codeNode = 
         {
            type: "code",
            expression: `${condition}?[%%%children%%%]:null`,
            children: [ node ],
            parent: parentnode 
         };

         node.parent = ifNode;

         assignDummyKey(node);

         replaceNode(parentnode as tagNode, node, ifNode);
      }
   }
   
   if(node.type === "tag" || node.type === "code" || node.type === "root")
   {  
      node.children.forEach(n => transform_if(n));
   }
}

