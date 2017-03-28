import escodegen = require("escodegen");
import { replaceAll } from "./replaceAll";
import path = require("path");

export function debug(msg: any) {
   console.log(msg);
}

export function printableString(s: string): string {
   let code = replaceAll(s, '"','\\"');    
   code = replaceAll(code, '\n','\\n');    
   code = replaceAll(code, '\r','\\r');    
   code = replaceAll(code, '\t','\\t');    
   code = replaceAll(code, '\\','\\\\');    

   return code;
}

export function printableRelativeFileName(s: string): string {
   return printableString(path.relative(__dirname, s));
}

export function jsString(s: string): string {
   const AST = {
      type: 'Literal',
      value: s
   };

   return escodegen.generate(AST);
}

export function isIdentifier(id: string): boolean
{
   return new RegExp("^([$_a-zA-Z]+[$_a-zA-Z0-9]*)$").test(id);
}

