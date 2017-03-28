import glob = require("glob");
import fs = require("fs");
import path = require('path');

import { opts, CommandLineOptions } from "./utils/options";
import { processFiles } from "./process/processFiles";

const exitCode = main(process.argv);
process.exit(exitCode);

export function main(argv: string[]) 
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

   processFiles(options._, options);

   return 0;
}
