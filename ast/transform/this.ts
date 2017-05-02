import { rootNode, firstNode, tagNode } from "../nodeTypes";
import { Keywords } from "../keywords";

export function transform_this(ast: rootNode)
{   
   // picks first defined tag
   let level_one_tags = ast.children.filter(node=>node.type==="first") as firstNode[];

   level_one_tags.forEach(firstTag => {
      if(firstTag.child.attribs[Keywords.thisAttribute]) 
      {
         let path = firstTag.child.attribs[Keywords.thisAttribute].rawText;
         ast.imports.push(`import { ${firstTag.mainTagName} } from "${path}";`);
         firstTag.thisUsed = true;
         delete firstTag.child.attribs[Keywords.thisAttribute];
      }
   });

   // TODO check that the "this" attribute is not specified in nested children

   // TODO check that it's not specified along with stateless
}
