import { rootNode, firstNode, tagNode } from "../nodeTypes";
import { Keywords } from "../keywords";

export function transform_export(root: rootNode)
{   
   // picks first defined tag
   let level_one_tags = root.children.filter(node=>node.type==="first") as firstNode[];

   let nrequire = 0, ndefault = 0, nexports = 0;

   level_one_tags.forEach(node => {  
      if(node.child.attribs[Keywords.export]) 
      {
         let ex = node.child.attribs[Keywords.export].rawText;         
         delete node.child.attribs[Keywords.export];

         nexports++;

              if(ex === "named") node.export = ex;
         else if(ex === "default") { node.export = ex; ndefault++; }
         else if(ex === "require") { node.export = ex; nrequire++; }
         else node.export = "named";
      }
   });

   if(nexports === 0)
   {
      // fallback: makes the first export default
      level_one_tags[0].export = "require";
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