import fs = require("fs");
import path = require('path');

import { CommandLineOptions } from "../utils/options";
import { replaceExtension as replaceExt } from "../utils/replace-extension";
import { processHtmlString } from "./processHtmlString";

/*
import md5 = require("blueimp-md5");
context.hash = md5(fileName,"rioct");
*/

export function processHtmlFile(fileName: string, options: CommandLineOptions)
{
   console.log(`processing ${path.basename(fileName)}`); 

   if(path.extname(fileName) !== '.html') {
      throw `only .html files can be processed`;
   }

   let html = fs.readFileSync(fileName).toString().replace(/^\uFEFF/, '');

   let jsx = processHtmlString(html, options, fileName);

   //let outName = replaceExt(fileName, options.typescript ? ".tag.tsx" : ".tag.jsx");
   let outName = fileName + ( options.typescript ? ".tsx" : ".jsx" );
     
   fs.writeFileSync(outName, jsx);   
}

