import { rootNode, firstNode, tagNode } from "../nodeTypes";
import { Keywords } from "../keywords";
import { getRootNode } from "../astNode";
import { getDescendingTagNode } from "../astNode";

export function transform_is(ast: rootNode)
{
   // picks first defined tag
   let level_one_tags = ast.children.filter(node=>node.type==="first") as firstNode[];   
  
   level_one_tags.forEach(firstTag => {

      // "is" keyword is in the descending tag node
      const tagnode = getDescendingTagNode(firstTag);

      if(!tagnode.attribs[Keywords.is]) 
      {
         tagnode.tagName = "div";
      }
      else
      {   
         tagnode.tagName = tagnode.attribs[Keywords.is].rawText;
         delete tagnode.attribs[Keywords.is];
      }
   });
}
