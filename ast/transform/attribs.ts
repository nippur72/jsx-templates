import { astNode, rootNode, codeNode, tagNode } from "../nodeTypes";
import { splitBrackets } from "../../utils/brackets";
import { CommandLineOptions } from "../../utils/options";
import { getRootNode } from "../astNode";
import { wrapRuntimeCheck } from "./debug";

export function transform_attribs(node: astNode)
{ 
   let root = getRootNode(node);   
   transform_attribs_inner(node, root);
}

function transform_attribs_inner(node: astNode, root: rootNode)
{
   if(node.type === "tag")
   {
      Object.keys(node.attribs).forEach(key => {

         // allow empty attributes
         if(node.attribs[key].rawText === "") 
         {
            node.attribs[key].rawText = `${root.brackets.open}true${root.brackets.close}`; 
         }

         node.attribs[key].text = splitBrackets(node.attribs[key].rawText, node.location);  // TODO fix location offset

         if(root.options.debugRuntimeCheck) {
            node.attribs[key].text = wrapRuntimeCheck(node.attribs[key].text, false, root);
         }
      });      
   }
   
   if(node.type === "tag" || node.type === "code" || node.type === "root")
   {  
      node.children.forEach(n => transform_attribs_inner(n, root));
   }  
}
