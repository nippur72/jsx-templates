import { astNode, rootNode, tagNode, eachNode, visit } from "../nodeTypes";
import { Keywords } from "../keywords";
import { replaceNode } from "./replaceNode";
import { attribute } from "../nodeTypes";

export function transform_each(node: astNode)
{   
   if(node.type === "tag")
   {
      let eachAttrib = node.attribs[Keywords.each];      
      if(eachAttrib !== undefined) 
      {         
         let ei = parseEach(eachAttrib.rawText);         
         delete node.attribs[Keywords.each];

         let parentnode = node.parent;

         if(parentnode === null || parentnode === undefined) {
            throw `${Keywords.each} can't be placed in a root node`;
         }

         // prepares a code node
         let newNode: eachNode = 
         {
            type: "each",
            collection: ei.collection,
            item: ei.item,
            index: ei.index,
            children: [ node ],
            parent: parentnode 
            //`${ei.collection}.map((${ei.item},${ei.index})=>[%%%children%%%])`,
         };

         node.parent = newNode;

         replaceNode(parentnode, node, newNode);

         /*
         // automatic key 
         if(node.attribs["key"] === undefined) 
         {
            node.attribs["key"] = `{${ei.index}}`;
         }
         */
      }
   }
   
   visit(node, (n)=>transform_each(n));
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

