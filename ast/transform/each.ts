import { astNode, rootNode, virtualNode, tagNode } from "../nodeTypes";
import { Keywords } from "../astNode";
import { replaceNode } from "./replaceNode";

export function transform_each(node: astNode)
{   
   if(node.type === "tag")
   {
      let eachAttrib = node.attribs[Keywords.each];      
      if(eachAttrib !== undefined) 
      {         
         let ei = parseEach(eachAttrib);         
         delete node.attribs[Keywords.each];

         let parentnode = node.parent;

         // prepares a virtual node
         let eachNode: virtualNode = 
         {
            type: "virtual",
            expression: `{${ei.collection}.map((${ei.item},${ei.index})=>%%%children%%%)}`,
            children: [ node ],
            parent: parentnode 
         };

         if(parentnode === null || parentnode === undefined) {
            throw `${Keywords.each} can't be placed in a root node`;
         }

         replaceNode(parentnode as tagNode, node, eachNode);
      }
   }
   
   if(node.type === "tag" || node.type === "virtual" || node.type === "root")
   {  
      node.children.forEach(n=>transform_each(n));
   }
}

interface IEach
{
   item: string;
   index: string;
   collection: string;
}

function parseEach(attrib: string): IEach
{
   const arr = attrib.split(' in ');
   if(arr.length !== 2) {
      throw `${Keywords.each} invalid 'in' expression '${attrib}'`;
   }
   const params = arr[0].split(',').map(s => s.trim());
   const item = params[0];
   const index = params[1] || `${item}Index`;
   const collection = arr[1].trim();

   return { item, index, collection };
}

