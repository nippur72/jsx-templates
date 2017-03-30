import { astNode, rootNode, codeNode, tagNode, commentNode, attributes } from "../nodeTypes";
import { getRootNode } from "../astNode";
import { Keywords } from "../keywords";
import { replaceAll } from "../../utils/replaceAll";

export function transform_script(node: astNode)
{   
   if(node.type === "script")
   {
      // TODO does not allow other attributes on the <script> tag

      // TODO allow <script> only on the first level node

      // TODO allow only one single text node as children

      let root = getRootNode(node);

      let content = node.script.trim();

      root.scripts.push(content);
         
      // change to comment node
      (node as any).type = "comment";
      (node as any as commentNode).comment = "";
   }
   
   if(node.type === "tag" || node.type === "code" || node.type === "root")
   {  
      node.children.forEach(n => transform_script(n));
   }
}

