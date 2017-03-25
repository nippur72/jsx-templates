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

export function entryPoint(options: CommandLineOptions) {  
   // loop over files and collect results

   var results: processResult[] = [];

   var allOk = true;

   let atLeastOne = false;

   _.each(options._, fileName => {
      var filesExpanded = glob.sync(fileName);
      _.each(filesExpanded, fileName => {
         atLeastOne = true;
         try
         {
            results.push(processHtmlFile(fileName, options)) 
         }
         catch(ex)
         {
            allOk = false;
            if(ex instanceof CompileError) {
               var ce = ex as CompileError;
               console.log(`${ce.fileName}: ${ce.message}`);
               if(ce.loc)  console.log(`in line ${ce.loc.line} column ${ce.loc.col}`);
               if(ce.snip) console.log(`${ce.snip}`);
            }
            else {
               console.log(ex);
            }
         }  
      });
   });

   if(!atLeastOne) {
      console.log("no input file(s) to process");
   }

   /*
   if(!allOk) {
      console.log("compile failed, aborting");
      process.exit(-1);
   }

   outputFile(results, options);
   */

   console.log("done");
}

/*
function outputFile(results: processResult[], options)
{
   // emit output file   
   var outputFileName = options.output;

   var styles = _.filter(_.map(results, r=> r.styleCommand()), item => item!=="")
   var statements = _.map(results, s => s.importCommand(options.trace));

   var output = "var Rioct = require('rioct').default;\n\n" + statements.join("\n") + "\n\n" + styles.join("\n") + "\n" + "module.exports = Rioct;\n"; 

   if(path.extname(outputFileName) !== '.js') {
      throw `can output only to JavaScript`;
   }

   fs.writeFileSync(outputFileName, output);   
}
*/

function processHtmlFile(fileName: string, options: CommandLineOptions): processResult {
   console.log(`processing ${fileName}`) 

   if(path.extname(fileName) !== '.html') {
      throw `only .html files can be processed`;
   }

   var html = fs.readFileSync(fileName).toString().replace(/^\uFEFF/, '');

   var context = new Context(); 
   context.html = html;  
   context.file = fileName;
   context.options = options;
   context.hash = md5(fileName,"rioct");

   var outName = replaceExt(fileName, options.typescript ? ".tag.ts" : ".tag.js");

   context.outName = outName;

   var result = processHtml(html, context);
   result.fileName = fileName;
   result.outName = outName;

   // writes to disk .js compiled template        
   fs.writeFileSync(outName, result.rtTemplateAugumented);   

   // writes to disk .rt source template        
   var outRtName = replaceExt(fileName, ".rt");
   fs.writeFileSync(outRtName, result.rtSource); 
   
   // writes to disk .jsx source template        
   var outJsxName = replaceExt(fileName, "._tsx");
   fs.writeFileSync(outJsxName, result.jsxResult); 
   
   return result;
}

