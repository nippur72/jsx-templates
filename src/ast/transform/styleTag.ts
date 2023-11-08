import { minify, prefixCss } from "react-style-tag/lib/transform";

import { astNode, rootNode, tagNode, commentNode, attributes, visit } from "../nodeTypes";
import { getRootNode } from "../astNode";
import { Keywords } from "../keywords";
import { replaceAll } from "../../utils/replaceAll";

const importRioctCommand = `import { updateStyles } from "rioct";`;

export function transform_style_tag(node: astNode)
{   
   if(node.type === "style")
   {
      // TODO does not allow other attributes on the <import> tag

      // TODO allow import only on the first level node

      let root = getRootNode(node);

      let styles = root.styles;

      if(styles.length === 0) 
      {
         root.imports.push(importRioctCommand);
      }
      
      // save style class names with _this_ for export
      getThisNames(node.style, Keywords.thisPrefix, root.hash, root.styleNames);
            
      let style = replaceAll(node.style, Keywords.thisPrefix, root.hash);

      styles.push(styleCommand(style, root.source.fileName));
         
      // change to comment node
      (node as astNode).type = "comment";
      (node as astNode as commentNode).comment = "";
   }
   
   visit(node, (n)=>transform_style_tag(n));      
}

function styleCommand(extractedStyle: string, tagName: string)
{
   if(extractedStyle) return `updateStyles(${sanitizeStyle(extractedStyle, tagName)});`;
   else return "";
}

function sanitizeStyle(style: string, tagName: string): string
{
   const prefixed = prefixCss(style);
      
   let compactStyle = minify(prefixed);

   return JSON.stringify(compactStyle);
}

function getThisNames(style: string, prefix: string, hash: string, styleNames: {[key: string]: string}) {

   const regex = /_this_(?<name>[a-zA-Z0-9\$_]*)/gm;   

   while(true) {
      const match = regex.exec(style);
      if(match === null) break;
      if(match.groups) {
         let name = match.groups["name"];
         styleNames[name] = hash+name;
      }
   }   
}