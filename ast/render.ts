import _ = require("lodash");

import { Keywords } from "./keywords";
import { astNode, rootNode, codeNode, tagNode, styleNode, commentNode, textNode } from "./nodeTypes";
import { attributes, attribute } from "./nodeTypes";
import { replaceAll } from "../utils/replaceAll";

export function render(node: astNode): string
{
        if(node.type === "root")    return renderRoot(node);
   else if(node.type === "tag")     return renderTag(node);
   else if(node.type === "style")   throw "unexpected style node";
   else if(node.type === "comment") return renderComment(node);
   else if(node.type === "text")    return renderText(node);
   else if(node.type === "code")    return renderCode(node);
   else throw `unknown node type '${(node as astNode).type}'`;   
}

function renderRoot(node: rootNode): string
{
   // writes import statements
   let result = node.imports.join("\r\n");
   result += "\r\n";  

   // writes style-loading code
   result += node.styles.join("\r\n");
   if(node.styles.length>0) result += "\r\n";

   // writes code from <script> tags
   result += node.scripts.join("\r\n");

   // writes the actual render function
   let children = node.children.map(n=>render(n)).join("");
   if(node.stateless) 
   {
      result += `const render = (props, context) => ${children};\r\n`;
   }
   else
   {
      result += `function render(this: any) { return (${children}); }\r\n`;
   }
   result += `export = render;`;
   return result;
}

function renderTag(node: tagNode): string
{
   let children = node.children.map(n=>render(n)).join("");
   let attribs = renderAttributes(node.attribs);
   let space = Object.keys(node.attribs).length>0 ? " " : "";
   let result = `<${node.tagName}${space}${attribs}>${children}</${node.tagName}>`;
   return result;
}

function renderAttributes(attrs: attributes): string
{
   let array = Object.keys(attrs).map(key => `${key}=${renderAttribute(attrs[key])}`);
   return array.join(" ");
}

function renderAttribute(attr: attribute): string
{
   if(attr.text.length === 1 && attr.text[0].isString) {
      // simple case, constant string, return it as-is
      return `"${attr.text[0].text}"`;
   }

   // complex case, it's a concatenated string expression

   let array = attr.text.map(e => {
      if(e.isString) return `"${e.text}"`; 
      else return e.text;
   });

   let chained = array.join(" + ");

   return `{${chained}}`;
}

function renderComment(node: commentNode): string
{
   // do not render empty comments, used to gracefully remove nodes from the tree
   if(node.comment === "") return "";

   // TODO sanitize comments
   // return `{/* ${node.comment} */}`;

   // comments are disabled
   return "";   
}

function renderText(node: textNode): string
{
   if(node.parent.type === "tag")
   {
      let chained = node.text.map(e => e.isString ? e.text : `{${e.text}}`);
      return chained.join("");
   }
   else if(node.parent.type === "code")
   {
      let chained = node.text.map(e => e.isString ? `"${e.text}"` : `${e.text}`);
      return chained.join(",");
   }
   else if(node.parent.type === "root") 
   {
      return ""; // any text at root level is ignored
   }
   else 
   {
      throw "?";
   }
}

function renderCode(node: codeNode): string
{
   let c = node.children.map(n=>render(n)).join(",");
   let expr = replaceAll(node.expression, "%%%children%%%", c); 
   if(node.parent.type === "tag") 
   {
      expr = `{${expr}}`;
   }
   return expr;
}
