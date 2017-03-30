import _ = require("lodash");

import { astNode, rootNode, codeNode, tagNode } from "../nodeTypes";
import { splitBrackets } from "../../utils/brackets";
import { eventConversion } from "../../utils/react-events";

export function transform_onevents(node: astNode)
{  
   if(node.type === "tag")
   {
      Object.keys(node.attribs).forEach(key => parseOnEvents(node, key, node.attribs[key].rawText));      
   }
   
   if(node.type === "tag" || node.type === "code" || node.type === "root")
   {  
      node.children.forEach(n => transform_onevents(n));
   }  
}

function parseOnEvents(node: tagNode, attrib: string, value: string): void
{
   if(attrib.indexOf("on") !== 0) return;

   // replace lowercase name for known events
   let properName = eventConversion[attrib];
   if(properName) {
      node.attribs[properName] = { rawText: value, text: [] };
      delete node.attribs[attrib];
   }

   // TODO make it selectable via CLI option

   /*
   TODO ? filter brackets for unknown event handlers too ?
   // filter brackets for unknown event handlers too
   if(!known) {
      tag.attribs[attrib] = cleanBrackets(tag.attribs[attrib], context.brackets);  
   }
   */

   /*
   TODO? disabled automatic binding

      var handler = tag.attribs[attrib];

      // autobinds "this.funcName"
      if(handler.indexOf("(")!==0) {
         handler = wrapHandler(handler, context);
         handler = handler+".bind(this)";
         //handler = wrapExpression(handler, context, false);
         handler = "{" + handler + "}";
      }
   
      tag.attribs[attrib] = handler;

      return;
   }
   */

   // TODO event ending in "Capture" ("onClickCapure")
}
