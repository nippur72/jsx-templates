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
import { entryPoint } from "./entryPoint";

export function main(argv) {
   var options;

   // process command line options
   try {
      options = opts.parseArgv(argv) as CommandLineOptions;
   }
   catch(ex) {
      console.log(ex.message);
      process.exit(-1);
   }
   entryPoint(options);
   return 0;
}


