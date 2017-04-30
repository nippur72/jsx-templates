import glob = require("glob");
import fs = require("fs");
import path = require('path');

import { opts, CommandLineOptions } from "./utils/options";
import { processFiles } from "./process/processFiles";
import { main_watcher, build_regex } from "./watcher/watcher";

//console.log(build_regex());

main(process.argv);

export function main(argv: string[]): any 
{   
   let options: CommandLineOptions;
   
   try 
   {
      options = opts(argv);
   }
   catch(ex) 
   {
      console.log(ex.message);      
      return -1;
   }   

   if(options.watch)
   {
      main_watcher(options);      
   }
   else
   {
      processFiles(options._, options);
      process.exit(0);
   }
}
