
import _ = require("lodash");
import cheerio = require("cheerio");

import { astNode, rootNode, virtualNode, tagNode, styleNode, commentNode, textNode, attributes } from "./nodeTypes";
import { transform } from "./transform/transform";
import { render } from "./render";

export const Keywords =
{
   is: "is",
   each: "each",
   if: "if",
   scope: "scope"
}

export function parseFromString(html: string): string
{
   // load DOM
   let rootNode = cheerio.load(html, {lowerCaseTags: false, lowerCaseAttributeNames: false, xmlMode: true, withStartIndices: true}); // xmlMode turned off to allow decode of &nbsp; 
   let tsx = parseHtmlToTsx(rootNode); 

   console.log("---- tsx ---------");
   console.log(tsx);
   console.log("------------------");
   
   let jsCode = transpile(tsx);
   return jsCode;
}

function fromCheerio(rootNode: CheerioStatic): rootNode
{
   let rootTags = _.filter(rootNode.root()[0].children, node => true);

   // put under a file-based root node
   let astRoot: rootNode = 
   {
      type: "root",            
      children: []
   };

   // collect all first level nodes
   _.forEach(rootTags, (e)=>astRoot.children.push(visit(e, astRoot)));   

   return astRoot;
}

function visit(x: CheerioElement, parent: astNode): astNode
{   
   let node: astNode;
   
   if(x.type === "tag")
   {
      node = {
         type: "tag",
         tagName: x.name,
         attribs: { ...x.attribs } as attributes,
         children: [],
         parent: parent
      };

      _.forEach(x.children, (e)=>(node as tagNode).children.push(visit(e, node)));
   }
   else if(x.type === "style")
   {
      node = {
         type: "style",         
         style: x["data"],
         parent: parent
      };      
   }
   else if(x.type === "comment")
   {
      node = {
         type: "comment",         
         comment: x["data"],
         parent: parent
      };      
   }
   else if(x.type === "text")
   {
      node = {
         type: "text",         
         text: x["data"],
         parent: parent
      };      
   }
   else throw `unknown node type '${x.type}'`;
                    
   return node;
}


export function parseHtmlToTsx(rootNode: CheerioStatic): string
{
   let ast = fromCheerio(rootNode);

   transform(ast);

   let tsx = render(ast);

   return tsx;
}

import * as ts from "typescript";

function transpile(source: string): string
{
   const compilerOptions: ts.CompilerOptions = { 
      module: ts.ModuleKind.CommonJS,
      target: ts.ScriptTarget.ES5,
      jsx: ts.JsxEmit.React,
   };

   let dia: ts.Diagnostic[] = []; 

   let trasnpiled = ts.transpile(source, compilerOptions, "file.tsx", dia, "testmodule");   

   return trasnpiled;
}

