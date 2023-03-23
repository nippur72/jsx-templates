import { rootNode, firstNode, tagNode } from "../nodeTypes";
import { Keywords } from "../keywords";
import { getDescendingTagNode } from "../astNode";

export function transform_export(root: rootNode)
{   
   // picks first defined tag
   let level_one_tags = root.children.filter(node=>node.type==="first") as firstNode[];

   let nrequire = 0, ndefault = 0, nexports = 0;

   level_one_tags.forEach(node => {

      // "export" keyword is in the descending tag node
      const tagnode = getDescendingTagNode(node);
      
      if(tagnode.attribs[Keywords.export]) 
      {
         let ex = tagnode.attribs[Keywords.export].rawText;         
         delete tagnode.attribs[Keywords.export];

         nexports++;

              if(ex === "named") node.export = ex;
         else if(ex === "default") { node.export = ex; ndefault++; }
         else if(ex === "require") { node.export = ex; nrequire++; }
         else node.export = "private";
      }
   });

   if(nexports === 0)
   {
      // fallback: if no export is explicited, first tag is exported
      // as named (if stateless) or require (if stateful)
      let ft = level_one_tags[0];
      if(ft.stateless !== undefined) ft.export = "named";
      else ft.export = "require";
   }

   if(ndefault > 1) 
   {
      throw "more than one default export";
   }

   if(nrequire > 1) 
   {
      throw "more than one export of type 'require'";
   }
}
