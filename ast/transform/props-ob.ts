import { astNode, rootNode, tagNode, visit } from "../nodeTypes";
import { Keywords } from "../keywords";
import { replaceNode } from "./replaceNode";
import { replaceAll } from "../../utils/replaceAll";
import { getRootNode } from "../astNode";
import { removeOptionalBrackets } from "../../utils/brackets";

export function transform_props(node: astNode)
{   
   if(node.type === "tag" && node.tagName !== Keywords.template)
   {
      let attr = node.attribs[Keywords.props];                 

      if(attr) 
      {
         node.props = attr.text;
         delete node.attribs[Keywords.props];
      }
   }
   
   visit(node, (n)=>transform_props(n));
}

