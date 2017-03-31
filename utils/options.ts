﻿
import optionator = require("optionator");

let pkg = require("../package.json");

let optsConfig = 
{
   prepend: [`${pkg.name}  v${pkg.version}`,
             `${pkg.description}`,
             `Usage:`,
             `jsx-templates <filename> [<args>]`].join('\n'),

   concatRepeatedArrays: true,

   mergeRepeatedObjects: true,

   options: [
      { heading: 'Options' }, 
      { option: 'help', alias: 'h', type: 'Boolean', description: 'Show help.' }, 
      { option: 'typescript', type: 'Boolean', default: 'false', required: false, description: 'Output typescript (.tsx) files.'},
      { option: 'debug-runtime-check', type: 'Boolean', default: 'false', required: false, description: 'Check expressions at runtime and debug to console.'},
      { option: 'debug-runtime-print-function', type: 'String', default: 'console.error', required: false, description: 'JavaScript function used to log runtime-checks messages.'},
      /*
      { option: 'trace', alias: 't', type: 'Boolean', default: 'false', required: false, description: 'Catches all runtime errors and logs them to the console.'},
      //{ option: 'new', alias: 'n', type: 'Boolean', required: false, description: 'Use new emit engine (do not rely on react-templates).'},

      { option: 'use-rioct-runtime', type: 'Boolean', default: 'false', required: false, description: 'uses "rioct" runtime for extra features'},
      { option: 'brackets', type: 'String', default: '{ }', required: false, description: 'Character used to delimit template expressions (separated by a space).'},
      { option: 'check-undefined', type: 'Boolean', default: 'false', required: false, description: "Report an error if an expression is 'undefined'."},      
      { option: 'normalize-html-whitespace', type: 'Boolean', default: 'true', required: false, description: 'Remove repeating whitespace from HTML text.'},
      { option: 'create-element-alias', type: 'String', required: false, description: 'Use an alias for "React.createElement()".'},
      { option: 'target-version', type: 'String', default: '15.0.0', description: 'React version to generate code for.' },
      { option: 'react-import-path', type: 'String', default: 'react', description: 'Dependency path for importing React.' },
      { option: 'lodash-import-path', type: 'String', default: 'lodash', description: 'Dependency path for importing lodash.' },
      { option: 'external-helpers', default: '', type: 'String', description: "Emit helper functions as external dependency (and do not rely on 'lodash')" }            
      */
   ]
};

export let opts = (args: string[]) => optionator(optsConfig).parseArgv(args);

export interface CommandLineOptions {
   _: string[];
   typescript: boolean;
   debugRuntimeCheck: boolean;
   debugRuntimePrintFunction: string;
   /*
   trace: boolean;
   //new: boolean;
   
   brackets: string; 
   useRioctRuntime: boolean;
   normalizeHtmlWhitespace: boolean;  
   checkUndefined: boolean;
   createElementAlias: string,
   targetVersion: string,
   reactImportPath: string,
   lodashImportPath: string,
   externalHelpers: string
   */
}

export function defaultOptions(): CommandLineOptions
{
   return {
      _: [],
      typescript: false,
      debugRuntimeCheck: false,
      debugRuntimePrintFunction: "console.error"
      /*
      trace: false,
      
      brackets: "{ }", 
      useRioctRuntime: false,
      normalizeHtmlWhitespace: true,
      checkUndefined: false,
      createElementAlias: '',
      targetVersion: '15.0.0',
      reactImportPath: 'react',
      lodashImportPath: 'lodash',
      externalHelpers: ''
      */
   };
}

