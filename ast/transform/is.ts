import { rootNode, tagNode } from "../nodeTypes";
import { Keywords } from "../keywords";

export function transform_is(ast: rootNode)
{
   // picks first defined tag
   let level_one_tags = ast.children.filter(node=>node.type==="tag");
   if(level_one_tags.length === 0)
   {
      throw "no tags defined";
   }

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
