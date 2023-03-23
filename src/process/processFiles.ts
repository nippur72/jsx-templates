
import glob = require("glob");

import { CommandLineOptions } from "../utils/options";
import { processHtmlFile } from "./processHtmlFile";

export function processFiles(files: string[], options: CommandLineOptions) 
{       
   let atLeastOne = false;

   files.forEach(fileName => {
      let filesExpanded = glob.sync(fileName);
      filesExpanded.forEach(fileName => {
         atLeastOne = true;
         processHtmlFile(fileName, options); 
      });
   });

   if(!atLeastOne)   
   {
      console.log("no input file(s) to process");
   }
   else 
   {
      console.log("done");
   }
}



