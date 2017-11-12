import { astNode } from "../nodeTypes";

export function assignDummyKey(node: astNode)
{
   if(node.type === "tag")
   {
      // assign a key if not present
      if(node.attribs["key"] === undefined) {
         node.attribs["key"] = { rawText: `__key_${node.location}`, text: [] };
      }
   }
   else if(node.type === "if")
   {
      node.true_children.forEach(n => assignDummyKey(n));
      node.false_children.forEach(n => assignDummyKey(n));      
   }
   else if(node.type === "comment")
   {
      // do nothing
   }
   else if(node.type === "each")
   {
      // do nothing
   }
   else if(node.type === "scope")
   {
      // do nothing
   }
   else if(node.type === "text")
   {
      // do nothing
   }
   else throw `can't assign automatic key to node of type '${node.type}'`;
}