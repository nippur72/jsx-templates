import { astNode, rootNode, codeNode, tagNode } from "../nodeTypes";
import { Keywords } from "../keywords";
import { assignDummyKey } from "./dummyKey";

export function transform_virtual(node: astNode)
{   
   if(node.type === "tag")
   {
      if(node.tagName === Keywords.virtual)
      {
         // TODO checks no attributes are on the <virtual> tag

         if(node.parent === null || node.parent === undefined) {
            throw `<${Keywords.virtual}> can't be placed in a root node`;
         }

         // turns into a code node
         (node as any as codeNode).type = "code";
         (node as any as codeNode).expression = `[%%%children%%%]`;         

         // set a dummy key on the children nodes
         node.children.filter(n=>n.type==="tag").forEach((n: tagNode) => assignDummyKey(n));
      }
   }
   
   if(node.type === "tag" || node.type === "code" || node.type === "root")
   {  
      node.children.forEach(n => transform_virtual(n));
   }
}

