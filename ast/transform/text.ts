import { astNode, rootNode, codeNode, tagNode } from "../nodeTypes";
import { splitBrackets } from "../../utils/brackets";

export function transform_text(node: astNode)
{  
   if(node.type === "text")
   {
      node.text = splitBrackets(node.rawText);
   }
   
   if(node.type === "tag" || node.type === "code" || node.type === "root")
   {  
      node.children.forEach(n => transform_text(n));
   }  
}

