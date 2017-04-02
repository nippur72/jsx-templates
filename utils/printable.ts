import path = require("path");

import { replaceAll } from "../utils/replaceAll";

export function quotableString(s: string): string 
{
   let code = replaceAll(s, '"','\\"');    
   code = replaceAll(code, '\n','\\n');    
   code = replaceAll(code, '\r','\\r');    
   code = replaceAll(code, '\t','\\t');    
   //code = replaceAll(code, '\\','\\\\');    

   return code;
}

export function printableString(s: string): string 
{
   let code = replaceAll(s, '\\','\\\\'); 
   code = replaceAll(code, '"','\\"');    
   code = replaceAll(code, '\n','\\n');    
   code = replaceAll(code, '\r','\\r');    
   code = replaceAll(code, '\t','\\t');          

   return code;
}

export function printableRelativeFileName(s: string): string 
{
   return printableString(path.relative(__dirname, s));
}
