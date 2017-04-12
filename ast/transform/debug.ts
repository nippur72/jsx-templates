import path = require("path");

import { literal, rootNode } from "../nodeTypes";
import { printableString, printableRelativeFileName } from "../../utils/printable";
import { CommandLineOptions } from "../../utils/options";
import { getLocation } from "../../utils/location";


export function wrapRuntimeCheck(expr: literal[], isTextExpression: boolean, root: rootNode): literal[]
{
   let result: literal[] = [];

   return expr.map(e => {
      if(e.isString) return e;

      let wrapped = wrapExpression(e.text, isTextExpression, root, e.startIndex);
      return { ...e, text: wrapped };
   });
}

function wrapExpression(jsCode: string, isTextExpression: boolean, root: rootNode, startIndex: number)
{  
   // TODO allow select via options
   const checkUndefined = true;

   // TODO add proper location
   let file = path.basename(root.source.fileName);
   let { line, col } = getLocation(root.source.html, startIndex);

   let location = `in file: '${printableRelativeFileName(file)}', line ${line}, col ${col}`;
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
         const $expr = (${jsCode});
         if(${wrongType}) {
            ${print}("${error}${message}");
         }
         return $expr;
      }
      catch(ex) {
         const msg = "${error}" + (ex.message || ex);
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
         const $expr = (${jsCode});
         return $expr;
      }
      catch(ex) {
         const msg = "${error}" + (ex.message || ex);
         ${print}(msg);
         throw msg;
      }
   }`;

   let fcall = `((${fn})())`;

   return fcall;
}

export function wrapImport(symbol: string, options: CommandLineOptions): string
{
   // TODO add file, location info
   let error = `failed to import: '${symbol}'`;
   let print = options.debugRuntimePrintFunction;

   let fn =`if(typeof ${symbol} === 'undefined') { const msg = "${error}"; ${print}(msg); throw msg; }`;
   return fn;
}

