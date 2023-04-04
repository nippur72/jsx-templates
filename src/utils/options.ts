
import optionator = require("optionator");

let pkg = require("../../package.json");

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
      { option: 'watch', alias: 'w', type: 'Boolean', default: 'false', description: 'Starts jsx-templates in watch mode.' }, 
      { option: 'typescript', type: 'Boolean', default: 'false', required: false, description: 'Output typescript (.tsx) files.'},
      { option: 'debug-runtime-check', type: 'Boolean', default: 'false', required: false, description: 'Check expressions at runtime and debug to console.'},
      { option: 'debug-runtime-print-function', type: 'String', default: 'console.error', required: false, description: 'JavaScript function used to log runtime-checks messages.'},
      { option: 'normalize-html-whitespace', type: 'Boolean', default: 'true', required: false, description: 'Remove repeating whitespace from HTML text.'},
      { option: 'brackets', type: 'String', default: '{ }', required: false, description: 'Characters used to delimit template expressions (separated by a space).'},
      { option: 'import_react', type: 'String', default: '', required: false, description: 'Typescript statement for importing React'},
   ]
};

export let opts = (args: string[]) => optionator(optsConfig).parseArgv(args);

export interface CommandLineOptions {
   _: string[];
   watch: boolean;
   typescript: boolean;
   debugRuntimeCheck: boolean;
   debugRuntimePrintFunction: string;
   normalizeHtmlWhitespace: boolean;  
   brackets: string; 
   import_react: string;
}

export function defaultOptions(): CommandLineOptions
{
   return {
      _: [],
      watch: false,
      typescript: false,
      debugRuntimeCheck: false,
      debugRuntimePrintFunction: "console.error",
      normalizeHtmlWhitespace: true,
      brackets: "{{ }}",
      import_react: '' 

      /*
      trace: false,
      
      
      useRioctRuntime: false,
      
      checkUndefined: false,
      createElementAlias: '',
      targetVersion: '15.0.0',
      reactImportPath: 'react',
      lodashImportPath: 'lodash',
      externalHelpers: ''
      */
   };
}

