import { rootNode, firstNode, tagNode, astNode, visit, virtualNode } from "../nodeTypes";
import { Keywords } from "../keywords";
import { getRootNode } from "../astNode";
import { isReactIdentifier }from "./rootTag";

// collects macro

export function transform_read_macro(node: astNode)
{
   if(node.type === "tag")
   {
      if(node.tagName === Keywords.macro)
      {
         let macroName = node.attribs["name"].rawText;
         if(macroName === undefined) throw `macro must have a name`;
         if(!isReactIdentifier(macroName)) throw `macro name ${macroName} must be React Component identifier`;
         let rootNode = getRootNode(node);
         rootNode.macro[macroName] = { ...node };
         (node as any).type = "comment";
      }
   }

   visit(node, (n)=>transform_read_macro(n));
}

export function transform_replace_macro(node: astNode)
{
   let rootNode = getRootNode(node);      
   inner(node);

   function inner(node: astNode)
   {
      if(node.type === "tag")
      {
         let macroNode = rootNode.macro[node.tagName];   

         if(macroNode !== undefined)
         {  
            // is a known macro
            
            // TODO: check must have no children

            // turn node into virtual
            node.tagName = "virtual";

            let child = macroNode.children.filter(e => e.type !== "comment");
            if(child.length !== 1) throw `macro must have a single direct children`;

            node.children = [ child[0] ];
         }
      }

      visit(node, (n)=>inner(n));
   }
}

