import { rootNode, tagNode } from "../nodeTypes";
import { Keywords } from "../keywords";

export function transform_this(ast: rootNode)
{   
   // picks first defined tag
   let level_one_tags = ast.children.filter(node=>node.type==="tag");
   if(level_one_tags.length === 0)
   {
      throw "no tags defined";
   }

   let firstTag = level_one_tags[0] as tagNode;

   if(firstTag.attribs[Keywords.thisAttribute]) 
   {
      let path = firstTag.attribs[Keywords.thisAttribute].rawText;
      ast.imports.push(`import { ${ast.mainTagName} } from "${path}";`);
      ast.thisUsed = true;
      delete firstTag.attribs[Keywords.thisAttribute];
   }

   // TODO check that the "this" attribute is not specified in nested children

   // TODO check that it's not specified along with stateless
}
