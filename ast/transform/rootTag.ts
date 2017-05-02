import { rootNode, firstNode, tagNode } from "../nodeTypes";
import { Keywords } from "../keywords";
import { getRootNode } from "../astNode";

export function transform_root_tag(ast: rootNode)
{
   // picks tags on the level one
   let level_one_tags = ast.children.filter(node=>node.type==="tag") as tagNode[];
   if(level_one_tags.length === 0)
   {
      throw "no tags defined";
   }

   // removes them
   ast.children = ast.children.filter(node => node.type != "tag" || level_one_tags.indexOf(node)==-1);

   // reinserts as firstNode nodes
   level_one_tags.forEach(node => {
      if(!isReactIdentifier(node.tagName))
      {
         throw `${node.tagName} is not a valid React.Component identifier`
      }
      let newNode: firstNode = {
         type: "first",
         child: node,
         parent: ast,
         stateless: undefined,
         mainTagName: node.tagName,
         thisUsed: false,
         export: "private"
      };
      node.parent = newNode;
      ast.children.push(newNode);
   })
}

export function isReactIdentifier(id: string): boolean
{
   return new RegExp("^([A-Z]+[$_a-zA-Z0-9]*)$").test(id);
}
