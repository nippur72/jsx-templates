import { astNode, rootNode, codeNode, tagNode } from "../nodeTypes";

export function assignDummyKey(node: tagNode)
{
   // assign a key if not present
   if(node.attribs["key"] === undefined) {
      node.attribs["key"] = { rawText: `__key_${node.location}`, text: [] };
   }
}