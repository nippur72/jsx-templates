import { astNode, rootNode, tagNode, virtualNode, visit } from "../nodeTypes";
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

         let vnode: virtualNode = node as any;

         // turns into a virtual node
         vnode.type = "virtual";
         
         // set a dummy key on the direct children nodes
         visit(node, n => assignDummyKey(n));         
      }
   }
   
   visit(node, (n)=>transform_virtual(n));       
}

