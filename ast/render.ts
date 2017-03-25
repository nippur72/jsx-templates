import _ = require("lodash");

import { Keywords } from "./astNode";
import { astNode, rootNode, virtualNode, tagNode, styleNode, commentNode, textNode } from "./nodeTypes";
import { replaceAll } from "../replaceAll";

export function render(node: astNode): string
{
        if(node.type === "root")    return renderRoot(node);
   else if(node.type === "tag")     return renderTag(node);
   else if(node.type === "style")   return renderStyle(node);
   else if(node.type === "comment") return renderComment(node);
   else if(node.type === "text")    return renderText(node);
   else if(node.type === "virtual") return renderVirtual(node);
   else throw `unknown node type '${(node as astNode).type}'`;   
}

function renderRoot(node: rootNode): string
{
   let children = node.children.map(n=>render(n)).join("");
   let result = `import React = require("react");\r\nconst render = (props) => ${children};\r\nexport = render;`;
   return result;
}

function renderTag(node: tagNode): string
{
   let children = node.children.map(n=>render(n)).join("");
   let attribs = _.map(node.attribs, (value,key) =>`${key}="${value}"`).join(" ");
   let space = Object.keys(attribs).length>0 ? " " : "";
   let result = `<${node.tagName}${space}${attribs}>${children}</${node.tagName}>`;
   return result;
}

function renderStyle(node: styleNode): string
{
   throw "not yet implemented";
}

function renderComment(node: commentNode): string
{
   // TODO sanitize comments
   return `/* ${node.comment} */`;
}

function renderText(node: textNode): string
{
   return `${node.text}`;
}

function renderVirtual(node: virtualNode): string
{
   let c = node.children.map(n=>render(n)).join("");
   let expr = replaceAll(node.expression, "%%%children%%%", c);   
   return expr;
}
