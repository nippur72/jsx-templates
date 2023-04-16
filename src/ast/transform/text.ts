import { astNode, rootNode, tagNode, visit } from "../nodeTypes";
import { splitBrackets } from "../../utils/brackets";
import { CommandLineOptions } from "../../utils/options";
import { getRootNode } from "../astNode";
import { Html5Entities } from "html-entities";
import { printableString } from "../../utils/printable";

let entities = new Html5Entities();

export function transform_text(node: astNode)
{ 
   let root = getRootNode(node);   
   transform_text_inner(node, root);
}

function transform_text_inner(node: astNode, root: rootNode)
{  
   if(node.type === "text")
   {
      node.text = splitBrackets(node.rawText, node.location);
      
      // perform HTML entities translation
      // note: some entities are decoded by cheerio, decoding and re-encoding is necessary
      node.text.forEach(e=>{ 
         if(e.isString) {
            e.text = entities.encode(entities.decode(e.text));
         }
      });
   }

   visit(node, (n)=>transform_text_inner(n, root));         
}

