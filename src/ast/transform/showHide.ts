import { astNode, rootNode, tagNode, visit } from "../nodeTypes";
import { splitBrackets, removeOptionalBrackets } from "../../utils/brackets";
import { CommandLineOptions } from "../../utils/options";
import { getRootNode } from "../astNode";
import { Keywords } from "../keywords";

export function transform_show_hide(node: astNode)
{ 
   let root = getRootNode(node);   
   transform_show_hide_inner(node, root);
}

function transform_show_hide_inner(node: astNode, root: rootNode)
{
   if(node.type === "tag")
   {
      Object.keys(node.attribs).forEach(attrib => {

         if(attrib === Keywords.show || attrib === Keywords.hide)
         {
            let vtrue  = attrib === "show" ? "" : "display: none;";
            let vfalse = attrib === "show" ? "display: none;" : "";

            let cond = removeOptionalBrackets(node.attribs[attrib].rawText, root.brackets);
            let add  = `${root.brackets.open} (${cond}) ? ${vtrue} : ${vfalse} ${root.brackets.close}`;
            
            if(node.attribs["style"] === undefined) 
            {             
               node.attribs["style"] = { rawText: add, text: [] };
            }
            else
            {
               let oldStyle = node.attribs["style"].rawText;
               node.attribs["style"].rawText = [ oldStyle, add ].join(" ");   
            }

            delete node.attribs[attrib];                     
         }
         
      });      
   }

   visit(node, (n)=>transform_show_hide_inner(n, root));   
}
