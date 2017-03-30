import { rootNode, tagNode } from "../nodeTypes";
import { Keywords } from "../keywords";
import { getRootNode } from "../astNode";

export function transform_root_tag(ast: rootNode)
{
   // picks first defined tag
   let level_one_tags = ast.children.filter(node=>node.type==="tag");
   if(level_one_tags.length === 0)
   {
      throw "no tags defined";
   }

   let firstTag = level_one_tags[0] as tagNode;

   // saves tag name for later use
   getRootNode(ast).mainTagName = firstTag.tagName;   
}
