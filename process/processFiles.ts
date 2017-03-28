
import glob = require("glob");
import _ = require("lodash");

import { CommandLineOptions } from "../utils/options";
import { processHtmlFile } from "./processHtmlFile";

export function processFiles(files: string[], options: CommandLineOptions) 
{       
   let atLeastOne = false;

   _.each(files, fileName => {
      let filesExpanded = glob.sync(fileName);
      _.each(filesExpanded, fileName => {
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



