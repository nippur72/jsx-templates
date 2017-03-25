import { extract as rtExtractor } from "./rtExtractor";
import { Context } from "./context";
import { CompileError } from "./CompileError";
import { processResult } from "./processResult";
import { getLine } from "./location";
import { processNode }from "./api";
import { wrapImports } from "./wrapImports";
import { parseBracketCliOption } from "./brackets";
import { replaceAll } from "./replaceAll";

import decamelize = require("decamelize");
import cheerio = require("cheerio");
import _ = require("lodash");

import { parseHtmlToTsx } from "./ast/astNode";

function processHtml(html: string, context: Context): processResult {

   // gets bracket system from command line option
   context.brackets = parseBracketCliOption(context.options.brackets);

   var result = new processResult();
   
   // load DOM
   var rootNode = cheerio.load(html, {lowerCaseTags: false, lowerCaseAttributeNames: false, xmlMode: true, withStartIndices: true}); // xmlMode turned off to allow decode of &nbsp; 
   
   result.jsxResult = parseHtmlToTsx(rootNode);

   // filter tag and style nodes
   var rootTags = _.filter(rootNode.root()[0].children, node => node.type === 'tag' || node.type === 'style');

   if(rootTags.length!==1) {      
      throw new CompileError(`tag must have a single root node, found ${rootTags.length} instead`, 
                              context.file, 
                              getLine(context.html, rootTags[0]) );
   }

   var root = rootTags[0] as CheerioElement;

   // assign tag name
   result.tagName = root.name.toLowerCase(); 
   context.tagName = result.tagName;    

   // TODO match with filename.html
   // TODO check for redefinition of standard tags

   result.functionName = `${decamelize(result.tagName)}_RT`;    // TODO fix for stateless functions   

   var headerTree = cheerio.load("");
   context.headerNodes = headerTree.root()[0];

   processNode(root, context, result);   

   var headerHtml = headerTree.html();   
   
   var rtHtml = headerHtml + "\r\n" + rootNode.root().html();
      
   var jsCode;
   
   /*
   if(context.options.new) 
   {
      var emitter = new Emitter();
      jsCode = emitter.emit(rootNode);
   }
   else 
   {
      // use "react-templates" as external engine         
      jsCode = rtExtractor(rtHtml, context.options.trace, result.tagName, context.options.typescript);       
   }
   */   
   
   // use "react-templates" as external engine         
   jsCode = rtExtractor(rtHtml, result.tagName, context);       

   jsCode = wrapImports(jsCode, context);   

   // patch to fix createElement typing hell
   if(context.options.typescript) {
      jsCode = replaceAll(jsCode, "import { createElement as h } from 'react';", "declare function h(...a:any[]);");             
      
      const r3 = /import ([$_a-zA-Z]+[$_a-zA-Z0-9]*) = require\(('.*\.html')\);/g;
      jsCode = jsCode.replace(r3, "declare function $1(...a:any[]); // import $1 = require($2);");  
   }

   result.outName = context.outName;

   let augmented = jsCode;
   
   if(context.options.useRioctRuntime)
   {   
      augmented += "\n\n" + result.importRioct() +
                   "\n"   + result.registerTag() +
                   "\n"   + result.styleCommand(context.options.trace);
   }
   
   //jsCode = escodegen.generate(esprima.parse(jsCode));   
   result.rtSource = rtHtml;
   result.rtTemplate = jsCode;
   result.rtTemplateAugumented = augmented;

   return result;
}

export { processHtml };
