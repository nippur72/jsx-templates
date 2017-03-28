import { astNode, rootNode, codeNode, tagNode } from "../nodeTypes";

// replaces "node" with "otherNode" in 
export function replaceNode(node: tagNode|codeNode, sourceNode: astNode, replaceWithNode: codeNode)
{
   node.children.forEach((n,i)=>{
      if(n===sourceNode) {
         node.children[i] = replaceWithNode;
         replaceWithNode.parent = node;         
      }
   });
}
