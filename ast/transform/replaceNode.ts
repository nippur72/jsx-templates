import { astNode, rootNode, tagNode, ifNode, virtualNode, visit } from "../nodeTypes";

// replaces "node" with "otherNode" in 
export function replaceNode(node: astNode, sourceNode: astNode, replaceWithNode: astNode)
{
   function replace(arr: astNode[])
   {
      arr.forEach((n,i)=>{
         if(n===sourceNode) {
            arr[i] = replaceWithNode;
            if(replaceWithNode.type !== "root") replaceWithNode.parent = node;         
         }   
      });
   };

   if(node.type === "tag" || node.type === "virtual" || node.type === "root" || node.type === "template" || node.type === "scope" || node.type === "each") 
   {
      replace(node.children);
   }
   else if(node.type === "first") 
   {
      if(node.child === sourceNode && replaceWithNode.type !== "root") 
      {
         if(replaceWithNode.type === "tag") node.child = replaceWithNode;      
         else throw `first level tags must be plain simple tags`;
      }
   }
   else if(node.type === "if") 
   {
      replace(node.true_children);
      replace(node.false_children);
   }
   else if(node.type === "comment")
   {
      // do nothing
   }
   else throw `unknown node type ${node.type}`;
}
