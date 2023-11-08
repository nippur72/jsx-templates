import * as fs from "fs";
import * as path from "path";
import * as glob from "glob";

import * as chalk from "chalk";

import filewatcher = require("filewatcher");
import { exec } from 'child_process';

import { processHtmlFile } from "../process/processHtmlFile";
import * as rh from "../utils/regexHelper";
             
import { defaultOptions, CommandLineOptions } from "../utils/options";

function watcher(options: CommandLineOptions) 
{
   const watchOpts = {
      forcePolling: false,  // try event-based watching first
      debounce: 10,         // debounce events in non-polling mode by 10ms
      interval: 1000,       // if we need to poll, do it every 1000ms
      persistent: true      // don't end the process while files are watched
   };

   let patharg = options._[0];
 
   // initial compilation, delete all *.html.tsx, *.html.d.ts and *.html.js files
   console.log("cleaning...");
   glob.sync(patharg + ".tsx" ).forEach(f => fs.unlinkSync(f));
   glob.sync(patharg + ".d.ts").forEach(f => fs.unlinkSync(f));
   glob.sync(patharg + ".js"  ).forEach(f => fs.unlinkSync(f));   
   glob.sync(patharg).forEach(f => compile(f, options));   
   console.log("done");

   const watcher = filewatcher(watchOpts);

   let files = glob.sync(patharg);
   
   console.log(`watching ${files.length} .html files in ${patharg}`);

   files.forEach(f=>watcher.add(f));
  
   watcher.on('change', (file, stat) => {
      
      if(!stat) {
         console.log(`File deleted: ${path.basename(file)}`);
         const tsxName = `${file}.tsx`;
         fs.unlinkSync(tsxName);
         watcher.remove(file);
         return;
      }      

      console.log(`File modified: ${path.basename(file)}`);
      compile(file, options);
   });  
}

function compile(file: string, options: CommandLineOptions) {
   processHtmlFile(file, options);
}

function tsc_watch()
{
   console.log("starting tspc in watch mode...");

   let child = exec("npx tspc --watch");

   child.stdout?.on('data', function(chunk) {
     // output will be here in chunks
     console.log("*** tsc out ***");
     report_tsc_error(chunk);
   });

   child.stderr?.on('data', function(chunk) {
     // output will be here in chunks
     console.log("*** tsc err ***");
     console.log(chunk);     
   });
}

export function main_watcher(options: CommandLineOptions)
{
   watcher(options);
   tsc_watch();
}

/*
src/tags/richieste-web/label-item.html.tsx(8,332): error TS1005: '}' expected.
*/

export function build_regex()
{
   let filename = rh.capture(rh.asFewAsPossible(rh.anychar));
   let number = rh.OneOrMore(rh.digit);
   let comma = rh.text(",");   
   let line_info = rh.text("(") + rh.capture(number) + comma + rh.capture(number) + rh.text("): ");
   let error_info = rh.capture(rh.asFewAsPossible(rh.anychar)) + rh.text(": ");
   let error_text = rh.nonCapture(rh.or(rh.anychar, rh.newline))
   let error_message = rh.capture(rh.asFewAsPossible(error_text));

   let r = rh.startOfLine + 
           filename +
           line_info + 
           error_info +
           error_message + 
           rh.endOfLine;

   return r;
}

function report_tsc_error(chunk)
{           
   let R = new RegExp(build_regex(), "gm");

   let atLeastOne = false;

   for(;;)
   {
      let matches = R.exec(chunk);
      if(matches !== null)
      {
         atLeastOne = true;
         let [all, filename, line, column, info, message ] = matches;
         console.log(chalk.yellow(`${filename}(${line},${column}):`));
         showFile(filename, Number(line), Number(column));
         console.log(chalk.red(message));
      }
      else break;
   }

   if(!atLeastOne) console.log(chunk);
}

function showFile(fn: string, line: number, column: number)
{
   line = line - 1;
   column = column - 1;

   const f = fs.readFileSync(fn).toString();

   const lines = f.split("\n");

   const L = lines[line];

   const start = Math.max(column - 40, 0);
   const drift = column - start;

   const piece = L.substr(start, 80);

   console.log(chalk.cyan(piece));

   let msg = "";
   for(let t=0;t<drift;t++) msg+=" ";
   console.log(chalk.cyan(msg+"^"));
}

