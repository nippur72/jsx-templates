import { rootNode, firstNode, tagNode } from "../nodeTypes";
import { Keywords } from "../keywords";
import { getDescendingTagNode } from "../astNode";

export function transform_this(ast: rootNode)
{   
   // picks first defined tag
   let level_one_tags = ast.children.filter(node=>node.type==="first") as firstNode[];

   level_one_tags.forEach(firstTag => {

      // "export" keyword is in the descending tag node
      const tagnode = getDescendingTagNode(firstTag);

      if(tagnode.attribs[Keywords.thisAttribute]) 
      {
         let path = tagnode.attribs[Keywords.thisAttribute].rawText;
         ast.imports.push(`import { ${firstTag.mainTagName} } from "${path}";`);
         firstTag.thisUsed = true;
         delete tagnode.attribs[Keywords.thisAttribute];
      }
   });

   // TODO check that the "this" attribute is not specified in nested children

   // TODO check that it's not specified along with stateless
}
