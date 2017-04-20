import { astNode, rootNode, tagNode, ifNode, visit } from "../nodeTypes";
import { Keywords } from "../keywords";
import { replaceNode } from "./replaceNode";
import { assignDummyKey } from "./dummyKey";

export function transform_if(node: astNode)
{  
   if(node.type === "tag")
   {
      let elseAttrib = node.attribs[Keywords.else];      
      if(elseAttrib !== undefined)
      {      
         throw `${Keywords.else} without ${Keywords.if}`;         
      }

      let ifAttrib = node.attribs[Keywords.if];      

      if(ifAttrib !== undefined) 
      {         
         let condition = ifAttrib.rawText;         
         delete node.attribs[Keywords.if];

         let parentnode = node.parent;

         if(parentnode === null || parentnode === undefined) {
            throw `${Keywords.if} can't be placed in a root node`;
         }

         let elseNode = getElseNode(node);
         let falseChildren: astNode[] = [];

         if(elseNode !== undefined)
         {
            let elseClone = { ...elseNode };
            delete elseClone.attribs[Keywords.else];
            falseChildren = [ elseClone ];
            (elseNode as any).type = "comment";
         }

         // prepares a code node
         let newNode: ifNode = 
         {
            type: "if",
            contidion: condition,
            true_children: [ node ],
            false_children: falseChildren,
            parent: parentnode 
         };

         node.parent = newNode;

         //assignDummyKey(node);

         replaceNode(parentnode, node, newNode);

         // force visit of the newly created node
         node = newNode; 
      }
   }   

   visit(node, (n)=>transform_if(n));
}

function getElseNode(node: tagNode): tagNode | undefined
{
   let parent = node.parent;

   if(parent.type !== "tag") return undefined;

   let thisNodeIndex = parent.children.indexOf(node);

   let children = parent.children.map((e,i) => (i>thisNodeIndex && e.type === "tag" ? e : undefined) ).filter(e=>e!==undefined);

   if(children.length === 0) return undefined;

   let firstChildren = children[0] as tagNode;

   if(!firstChildren.attribs) return undefined;

   if(!firstChildren.attribs[Keywords.else]) return undefined;

   return firstChildren;
}
