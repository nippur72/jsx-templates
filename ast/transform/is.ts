import { rootNode, firstNode, tagNode } from "../nodeTypes";
import { Keywords } from "../keywords";
import { getRootNode } from "../astNode";

export function transform_is(ast: rootNode)
{
   // picks first defined tag
   let level_one_tags = ast.children.filter(node=>node.type==="first") as firstNode[];   
  
   level_one_tags.forEach(firstTag => {
      if(!firstTag.child.attribs[Keywords.is]) 
      {
         firstTag.child.tagName = "div";
      }
      else
      {   
         firstTag.child.tagName = firstTag.child.attribs[Keywords.is].rawText;
         delete firstTag.child.attribs[Keywords.is];
      }
   });
}
