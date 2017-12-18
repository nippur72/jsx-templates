import { rootNode, firstNode, tagNode } from "../nodeTypes";
import { Keywords } from "../keywords";
import { getDescendingTagNode } from "../astNode";

export function transform_stateless(root: rootNode)
{   
   // picks first defined tag
   let level_one_tags = root.children.filter(node=>node.type==="first") as firstNode[];
   if(level_one_tags.length === 0)
   {
      throw "no tags defined";
   }

   level_one_tags.forEach(node => {  

      // "stateless" keyword is in the descending tag node
      const tagnode = getDescendingTagNode(node);

      if(tagnode.attribs[Keywords.stateless]) 
      {
         node.stateless = tagnode.attribs[Keywords.stateless].rawText;
         delete tagnode.attribs[Keywords.stateless];
      }
   });

   // TODO check that the "stateless" attribute is not specified in nested children
}
