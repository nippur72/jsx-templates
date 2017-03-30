import _ = require("lodash");

import { astNode, rootNode, codeNode, tagNode } from "../nodeTypes";
import { splitBrackets } from "../../utils/brackets";

export function transform_style_attrib(node: astNode)
{  
   if(node.type === "tag")
   {
      if(node.attribs["style"]) 
      {
         node.attribs["style"].rawText = handleStyleProp(node.attribs["style"].rawText);
      }
   }
   
   if(node.type === "tag" || node.type === "code" || node.type === "root")
   {  
      node.children.forEach(n => transform_style_attrib(n));
   }  
}


// predated from react-templates
function handleStyleProp(val: string): string 
{
   let styleStr = val.split(';').map(e => _.trim(e)).filter(i => _.includes(i, ':')).map(i =>
   {
      let pair = i.split(':');
      let key = pair[0].trim();
      if (/\{|\}/g.test(key)) {
         // TODO change regex into check kebab-case identifier syntax
         throw 'style attribute keys cannot contain { } expressions';
      }
      let value = pair.slice(1).join(':').trim();
      let parsedKey = /(^-moz-)|(^-o-)|(^-webkit-)/ig.test(key) ? _.upperFirst(_.camelCase(key)) : _.camelCase(key);
      let expr = splitBrackets(value.trim()).map(e => e.isString ? `"${e.text}"` : `${e.text}`).join("+");
      return parsedKey + ' : ' + expr;
   }).join(',');
   return '{{ {' + styleStr + '} }}';
}

