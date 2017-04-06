import path = require("path");

import { literal, rootNode } from "../nodeTypes";
import { printableString, printableRelativeFileName } from "../../utils/printable";
import { CommandLineOptions } from "../../utils/options";


export function wrapRuntimeCheck(expr: literal[], isTextExpression: boolean, root: rootNode)
{
   let result: literal[] = [];

   return expr.map(e => {
      if(e.isString) return e;

      let wrapped = wrap(e.text, isTextExpression, root);
      return { text: wrapped, isString: e.isString };
   })
}

function wrap(expr: string, isTextExpression: boolean, root: rootNode): string
{
   // TODO special case <yield> tag and other hacks
   /*
      // special case of <yield> tag
      if(jsCode==="this.props.children" || jsCode==="props.children") isTextExpression = false;
   */

   let wrapped = wrapExpression(expr, isTextExpression, root);

   // TODO previously wrapped was checked with esprima
   /*
   try
   {
      var checkJs = esprima.parse(expr);
   }
   catch(ex) 
   {      
      throw new CompileError(`javascript error when parsing: ${jsCode}`,
                              context.file, 
                              getLine(context.html, context.tag), 
                              ex.description);                  
   }
   */

   return wrapped;
}

function wrapExpression(jsCode: string, isTextExpression: boolean, root: rootNode)
{  
   // TODO allow select via options
   const checkUndefined = true;

   // TODO add proper location
   let file = path.basename(root.source.fileName);
   let line = "???";
   let column = "???";

   let location = `in file: '${printableRelativeFileName(file)}', line ${line}, col ${column}`;
   let pcode = printableString(jsCode);
   let error = `runtime error when evaluating: ${pcode}\\n${location}\\n`;
   let print = root.options.debugRuntimePrintFunction;
   let message;
   let retval;

   let wrongType: string;

   if(isTextExpression)
   {
      if(checkUndefined) wrongType = "$expr !== null && typeof $expr !== 'string' && typeof $expr !== 'number'";
      else               wrongType = "$expr !== null && typeof $expr !== 'string' && typeof $expr !== 'number' && typeof $expr !== 'undefined'" ;
      message = `expression must be of type 'string' or 'number', instead is '"+(typeof $expr)+"'`;
      retval = '"???"';
   }
   else
   {
      if(checkUndefined) wrongType = "typeof $expr === 'undefined'";
      else               wrongType = "false";
      message = `expression must be not be undefined, instead is '"+(typeof $expr)+"'`;
      retval = "undefined";
   }  

   let fn =`() => {
      try {
         let $expr = (${jsCode});
         if(${wrongType}) {
            ${print}("${error}${message}");
         }
         return $expr;
      }
      catch(ex) {
         var msg = "${error}" + (ex.message || ex);
         ${print}(msg);
         throw msg;
      }
   }`;

   let fcall = isTextExpression ? `(((${fn})()) as number|string|null)` : `((${fn})())`;

   return fcall;
}

export function wrapRenderFunction(jsCode: string, options: CommandLineOptions): string
{
   let error = `runtime error when evaluating render function: `;
   let print = options.debugRuntimePrintFunction;

   let fn =`() => {
      try {
         let $expr = (${jsCode});
         return $expr;
      }
      catch(ex) {
         var msg = "${error}" + (ex.message || ex);
         ${print}(msg);
         throw msg;
      }
   }`;

   let fcall = `((${fn})())`;

   return fcall;
}