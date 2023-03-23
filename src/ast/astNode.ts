
import * as cheerio from "cheerio";
import { CommandLineOptions } from "../utils/options";
import { astNode, rootNode, firstNode, tagNode, styleNode, commentNode, textNode } from "./nodeTypes";
import { attributes } from "./nodeTypes";
import { transform } from "./transform/transform";
import { render } from "./render";
import md5 = require("blueimp-md5");
import normalizeHtmlWhitespace = require('normalize-html-whitespace');
import { getLocation } from "../utils/location";
import { ltrim, rtrim } from "../utils/trim";
import { parseBracketCliOption } from "../utils/brackets";
import { trimAfter, trimBefore } from "../utils/trim";

type CheerioAttributes = {[key:string]:string};

export function htmlToTsx(html: string, options: CommandLineOptions, fileName: string): string
{
   let cheerioTree = cheerio.load(html, {
      lowerCaseTags: false, 
      lowerCaseAttributeNames: false, 
      xmlMode: false,  // keep <style> and <script> as text
      decodeEntities: false, 
      recognizeSelfClosing: true, 
      withStartIndices: true
   }); 

   let ast = buildTreeFromCheerio(cheerioTree, fileName, options, html);

   transform(ast);

   let tsx = render(ast);

   return tsx;
}

function buildTreeFromCheerio(rootNode: cheerio.Root, fileName: string, options: CommandLineOptions, html: string): rootNode
{
   let firstTag = rootNode.root()[0];

   if(!('children' in firstTag)) throw `First tag must not be text or comment`

   let rootTags = firstTag.children.filter(node => true);  // ?? TODO 

   // put under a file-based root node
   let root: rootNode = 
   {
      type: "root",            
      children: [],      
      imports: [`import React = require("react");`],
      importedSymbols: [],      
      styles: [],
      scripts: [],
      hash: `_${md5(fileName, "jsx-templates").substr(0,8)}_`,      
      options: options,
      source: { html, fileName },
      brackets: parseBracketCliOption(options.brackets),
      macro: {}
   };

   // collect all first level nodes
   let indent = 0;
   rootTags.forEach(e => root.children.push(visit(e, root, root, indent)));   

   // filters empty text children
   //root.children = root.children.filter(n => !(n.type === "text" && n.rawText.trim().length === 0));

   return root;
}

function visit(x: cheerio.Element, parent: astNode, root: rootNode, indent: number): astNode
{   
   let node: astNode;
   
   if(x.type === "tag")
   {
      node = {
         type: "tag",
         tagName: x.name,
         attribs: attributesFromCheerio(x.attribs as CheerioAttributes),
         children: [],
         parent: parent,
         location: x.startIndex ?? 0,
         indent: indent,
         props: []
      };

      x.children.forEach(e =>(node as tagNode).children.push(visit(e, node, root, indent + 1)));

      // filters empty text children
      //node.children = node.children.filter(n => !(n.type === "text" && n.rawText.trim().length === 0));
   }
   else if(x.type === "style")
   {
      // grab style text 
      let grabbedStyle = "";
      x.children.forEach(child => {
         let style = child.data;         
         grabbedStyle += style;
      });                                                          

      node = {
         type: "style",         
         style: grabbedStyle,
         parent: parent,
         location: x.startIndex ?? 0
      };      
   }
   else if(x.type === "script")
   {
      // grab script text 
      let grabbedScript = "";
      x.children.forEach(child => {
         let style = child.data;         
         grabbedScript += style;
      });                                                          

      node = {
         type: "script",         
         script: grabbedScript,
         parent: parent,
         location: x.startIndex ?? 0
      };      
   }
   else if(x.type === "comment")
   {
      node = {
         type: "comment",         
         comment: x.data ?? "",
         parent: parent,
         location: x.startIndex ?? 0
      };      
   }
   else if(x.type === "text")
   {
      let rawText = x.data ?? "";

      // trim extra space between components if there are new lines
      rawText = trimAfter(trimBefore(rawText));

      // if is empty, discard it
      if(rawText === "")
      {
         node = { 
            type: "comment", 
            comment: "", 
            parent: parent,
            location: x.startIndex ?? 0
         };
         return node;
      }

      if(root.options.normalizeHtmlWhitespace) 
      {
         rawText = normalizeHtmlWhitespace(rawText);
      }           

      node = {
         type: "text",         
         rawText: rawText,
         text: [],
         parent: parent,
         location: x.startIndex ?? 0
      };      
   }
   else throw `unknown node type '${x.type}'`;
                    
   return node;
}

function attributesFromCheerio(attrs: CheerioAttributes): attributes
{
   let result: attributes = {};

   Object.keys(attrs).forEach( key => {
      let value = attrs[key];      
      result[key] = { rawText: value, text: [] };
   });

   return result;
}

export function getRootNode(ast: astNode): rootNode
{
   if(ast.type === "root") return ast;
   else return getRootNode(ast.parent);
}

export function getFirstNode(ast: astNode): firstNode
{
   if(ast.type !== "root")
   {
      if(ast.parent.type === "root") return ast as firstNode;
      else return getFirstNode(ast.parent);
   }
   else throw "can't go to firstNode from rootNode";
}

export function getDescendingTagNode(node: firstNode): tagNode {
   function getTag(n: astNode): tagNode {
           if(n.type === "scope") return getTag(n.children[0]);
      else if(n.type === "first") return getTag(n.child);
      else if(n.type === "tag") return n;
      else throw `unhandled node type '${n.type}' in getDescendingTagNode()`;
   }
   return getTag(node);
}

