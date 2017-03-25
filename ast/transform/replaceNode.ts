import { astNode, rootNode, virtualNode, tagNode } from "../nodeTypes";

// replaces "node" with "otherNode" in 
export function replaceNode(node: tagNode|virtualNode, sourceNode: astNode, replaceWithNode: virtualNode)
{
   node.children.forEach((n,i)=>{
      if(n===sourceNode) {
         node.children[i] = replaceWithNode;
         replaceWithNode.parent = node;
      }
   });
}
