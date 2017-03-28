//
// extract results from command line utility "rt" (react-templates)
//

import rt = require("react-templates/src/reactTemplates");
import { Context } from "./context";
import { CommandLineOptions } from "./options";
import { wrapCodeCommonJs, wrapCodeTypeScript } from "./wrapCode";

export function extract(rtHtml: string, tagName: string, context: Context): string
{
   const rtOptions = {
      modules: context.options.typescript ? 'typescript' : 'commonjs',
      version: false,
      format: 'stylish',
      native: false,
      targetVersion: context.options.targetVersion,
      reactImportPath: context.options.reactImportPath,
      lodashImportPath: context.options.lodashImportPath,
      normalizeHtmlWhitespace: context.options.normalizeHtmlWhitespace,
      createElementAlias: context.options.createElementAlias,
      externalHelpers: context.options.externalHelpers,
   };
   
   var jsCode;
   
   try 
   {      
      jsCode = rt.convertTemplateToReact(rtHtml, rtOptions);
   }
   catch(ex) 
   {
      console.log(ex);
      //console.log(rtHtml);
      return "";
   }

   return context.options.typescript ? wrapCodeTypeScript(jsCode, context.options.trace, tagName, context.isStateless) : wrapCodeCommonJs(jsCode, context.options.trace, tagName, context.isStateless);
}     

