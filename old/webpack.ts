import { processHtml } from "./processHtml";
import { Context } from "./context";
import { CompileError } from "./CompileError";
import { processResult } from "./processResult";
import { opts, CommandLineOptions } from "./options";
import { replaceExtension as replaceExt } from "./replace-extension";

import glob = require("glob");
import fs = require("fs");
import path = require('path');
import _ = require("lodash");

import md5 = require("blueimp-md5");

export function webpack(source: string, options: CommandLineOptions, fileName?: string|undefined): string 
{  
   const write = fileName !== undefined;
   fileName = fileName || "file";

   if(write) 
   {
      console.log(`rioct convert: ${path.basename(fileName)}`);       

      if(path.extname(fileName) !== '.html') {
         throw `only .html files can be processed`;
      }
   }

   const html = source;

   var context = new Context(); 
   context.html = html;  
   context.file = fileName;
   context.options = options;
   context.hash = md5(fileName,"rioct");

   const outName = replaceExt(fileName, options.typescript ? ".tag.ts" : ".tag.js");

   context.outName = outName;

   var result = processHtml(html, context);
   result.fileName = fileName;
   result.outName = outName;

   if(write) 
   {
      // writes to disk .js compiled template        
      fs.writeFileSync(outName, result.rtTemplateAugumented);   

      // writes to disk .rt source template        
      const outRtName = replaceExt(fileName, ".rt");
      fs.writeFileSync(outRtName, result.rtSource); 
   }

   return result.rtTemplateAugumented;
}

