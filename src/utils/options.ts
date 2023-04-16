
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
      { option: 'normalize-html-whitespace', type: 'Boolean', default: 'true', required: false, description: 'Remove repeating whitespace from HTML text.'},
      { option: 'brackets', type: 'String', default: '{ }', required: false, description: 'Characters used to delimit template expressions (separated by a space).'},
      { option: 'import_react', type: 'String', default: '', required: false, description: 'Typescript statement for importing React'},
   ]
};

export let opts = (args: string[]) => optionator(optsConfig).parseArgv(args);

export interface CommandLineOptions {
   _: string[];
   watch: boolean;
   normalizeHtmlWhitespace: boolean;
   brackets: string; 
   import_react: string;
}

export function defaultOptions(): CommandLineOptions
{
   return {
      _: [],
      watch: false,
      normalizeHtmlWhitespace: true,
      brackets: "{{ }}",
      import_react: ''
   };
}

