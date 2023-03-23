import fs = require("fs");
import path = require('path');

import { CommandLineOptions } from "../utils/options";
import { processHtmlString } from "./processHtmlString";

export function processHtmlFile(fileName: string, options: CommandLineOptions)
{
   console.log(`processing ${path.basename(fileName)}`); 

   if(path.extname(fileName) !== '.html') {
      throw `only .html files can be processed`;
   }

   let html = fs.readFileSync(fileName).toString().replace(/^\uFEFF/, '');

   let jsx = processHtmlString(html, options, fileName);

   let outName = fileName + ( options.typescript ? ".tsx" : ".jsx" );
     
   fs.writeFileSync(outName, jsx);   
}

