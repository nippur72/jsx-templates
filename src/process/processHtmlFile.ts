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

   let tsx = processHtmlString(html, options, fileName);

   let outName = `${fileName}.tsx`;
     
   fs.writeFileSync(outName, tsx);
}

