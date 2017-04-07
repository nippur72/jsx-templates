import { astNode, rootNode, codeNode, tagNode } from "../nodeTypes";
import { splitBrackets } from "../../utils/brackets";
import { CommandLineOptions } from "../../utils/options";
import { getRootNode } from "../astNode";
import { wrapRuntimeCheck } from "./debug";

export function transform_text(node: astNode)
{ 
   let root = getRootNode(node);   
   transform_text_inner(node, root);
}

function transform_text_inner(node: astNode, root: rootNode)
{  
   if(node.type === "text")
   {
      node.text = splitBrackets(node.rawText, node.location);

      if(root.options.debugRuntimeCheck) {
         node.text = wrapRuntimeCheck(node.text, true, root);
      }
   }
   
   if(node.type === "tag" || node.type === "code" || node.type === "root")
   {  
      node.children.forEach(n => transform_text_inner(n, root));
   }  
}

