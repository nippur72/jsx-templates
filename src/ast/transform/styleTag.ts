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

