import { rootNode, tagNode } from "../nodeTypes";
import { Keywords } from "../keywords";
import { getRootNode } from "../astNode";

export function transform_is(ast: rootNode)
{
   // picks first defined tag
   let level_one_tags = ast.children.filter(node=>node.type==="tag");   

   let firstTag = level_one_tags[0] as tagNode;

   if(!firstTag.attribs[Keywords.is]) 
   {
      firstTag.tagName = "div";
   }
   else
   {   
      firstTag.tagName = firstTag.attribs[Keywords.is].rawText;
      delete firstTag.attribs[Keywords.is];
   }
}
