import { astNode, rootNode, tagNode, commentNode, attributes, visit, disableNode } from "../nodeTypes";
import { getRootNode } from "../astNode";
import { Keywords } from "../keywords";
import { replaceAll } from "../../utils/replaceAll";
import { putInScope } from "./scope";

export function transform_script(node: astNode)
{   
   if(node.type === "script")
   {
      // TODO does not allow other attributes on the <script> tag

      // TODO allow <script> only on the first level node

      // TODO allow only one single text node as children

      if(node.parent.type === "root") {
         // put as global script code
         let root = getRootNode(node);
         let content = node.script.trim();
         root.scripts.push(content);            
         disableNode(node);
      }
      else {
         // put as scoped script code on the parent node
         let code = node.script.trim();
         let parent = node.parent;
         disableNode(node);

         if(parent.type !== "tag") throw `script can be put placed only under root nodes or tags`;
         putInScope(parent, code);
      }
   }
   
   visit(node, (n)=>transform_script(n));
}

