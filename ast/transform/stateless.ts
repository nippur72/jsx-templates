import { rootNode, tagNode } from "../nodeTypes";
import { Keywords } from "../keywords";

export function transform_stateless(ast: rootNode)
{   
   // picks first defined tag
   let level_one_tags = ast.children.filter(node=>node.type==="tag");
   if(level_one_tags.length === 0)
   {
      throw "no tags defined";
   }

   let firstTag = level_one_tags[0] as tagNode;

   if(firstTag.attribs[Keywords.stateless]) 
   {
      ast.stateless = true;
      delete firstTag.attribs[Keywords.stateless];
   }

   // TODO check that the "stateless" attribute is not specified in nested children
}
