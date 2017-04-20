import { astNode, rootNode, tagNode, visit } from "../nodeTypes";
import { Keywords } from "../keywords";
import { replaceNode } from "./replaceNode";
import { replaceAll } from "../../utils/replaceAll";
import { getRootNode } from "../astNode";
import { removeOptionalBrackets } from "../../utils/brackets";

export function transform_class(node: astNode)
{   
   if(node.type === "tag")
   {
      let attr1 = node.attribs["class"];      
      let attr2 = node.attribs["className"]; 
      
      let list: string[] = [];

      if(attr1 !== undefined) list.push(attr1.rawText);
      if(attr2 !== undefined) list.push(attr2.rawText);

      if(list.length > 0) {
         delete node.attribs["class"];
         let combined = list.join(" ");

         // changes _this_ into hashed identifier
         let root = getRootNode(node);
         combined = replaceAll(combined, Keywords.thisPrefix, root.hash);

         // allow class-object syntax
         let obj_syntax = removeOptionalBrackets(combined, {open:"{{", close: "}}"}).trim(); // TODO use default brackets
         if(obj_syntax.charAt(0)==="{" && obj_syntax.charAt(obj_syntax.length-1)==="}") 
         {
            combined = replaceAll("{{((o)=>Object.keys(o).filter(k=>o[k]).join(' '))(%%ob%%)}}","%%ob%%", obj_syntax);
         }

         node.attribs["className"] = { rawText: combined, text: [] };            
      }
   }
   
   visit(node, (n)=>transform_class(n));       

   // TODO class-obj attribute
   /*
      <div class="pippo" className="pluto" class-obj="some"></div>
      => className={"pippo pluto " + ((arr)=>Object.keys(arr).map(e=>arr[e]?:e:null).filter(n=>n).join(" ")((expr)}
   */
}

