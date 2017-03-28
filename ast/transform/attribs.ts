import { astNode, rootNode, codeNode, tagNode } from "../nodeTypes";
import { splitBrackets } from "../../utils/brackets";

export function transform_attribs(node: astNode)
{  
   if(node.type === "tag")
   {
      Object.keys(node.attribs).forEach(key => {
         node.attribs[key].text = splitBrackets(node.attribs[key].rawText);
      });      
   }
   
   if(node.type === "tag" || node.type === "code" || node.type === "root")
   {  
      node.children.forEach(n => transform_attribs(n));
   }  
}
