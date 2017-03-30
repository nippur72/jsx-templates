import { astNode, rootNode, codeNode, tagNode } from "../nodeTypes";
import { Keywords } from "../keywords";
import { replaceNode } from "./replaceNode";
import { replaceAll } from "../../utils/replaceAll";
import { getRootNode } from "../astNode";

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
         combined = replaceAll(combined, Keywords.this, root.hash);

         node.attribs["className"] = { rawText: combined, text: [] };            
      }
   }
   
   if(node.type === "tag" || node.type === "code" || node.type === "root")
   {  
      node.children.forEach(n => transform_class(n));
   }

   // TODO class-obj attribute
   /*
      <div class="pippo" className="pluto" class-obj="some"></div>
      => className={"pippo pluto " + ((arr)=>Object.keys(arr).map(e=>arr[e]?:e:null).filter(n=>n).join(" ")((expr)}
   */
}

