import { rootNode, tagNode } from "../nodeTypes";
import { Keywords } from "../astNode";

export function transform_is(ast: rootNode)
{
   // picks first defined tag
   let level_one_tags = ast.children.filter(node=>node.type==="tag");
   if(level_one_tags.length === 0)
   {
      throw "no tags defined";
   }

   let firstTag = level_one_tags[0] as tagNode;

   if(!firstTag.attribs[Keywords.is]) firstTag.attribs[Keywords.is] = "div";
   
   firstTag.tagName = firstTag.attribs[Keywords.is];
   delete firstTag.attribs[Keywords.is];
}
