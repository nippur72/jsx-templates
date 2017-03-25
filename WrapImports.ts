import { capture, zeroOrOne, text } from "./regexHelper";
import { Context } from "./context";
import { printableString } from "./utils";

export function wrapImports(code: string, context: Context) {
   let lines = code.split('\n');

   for(let t=0; t<lines.length; t++) 
   {
      let l = lines[t];
      if(l.match(/require\(/)) {
         lines[t] = wrapSingleImportCommonJs(l, context);
      }
      if(l.match(/= function \(/)) {
         break;
      }
   }

   return lines.join('\n');
}

function wrapSingleImportCommonJs(line: string, context: Context): string {
   const Id = "[$_a-zA-Z]+[$_a-zA-Z0-9]*";
   const quoted_string = "'.*'";

   // must match one of these:
   // "var mycom0 = require('./mycomponent').default;"
   // "var mycom0 = require('./mycomponent');"

   let pattern = text("var ") + capture(Id) + text(" = require(") + capture(quoted_string) + text(")") + zeroOrOne(text(".") + capture(Id)) + text(";");

   let regex = new RegExp(pattern,"i");

   let m = regex.exec(line);

   if(m == null) return line;

   const aliasName = m[1];
   const fileName = m[2];
   const memberName = m[3];
   
   if(!context.options.trace) 
   {
      return `var ${aliasName} = require(${fileName})${memberName?'.'+memberName:''};`;      
   }
   else
   {
      return createTraceCodeCommonJs(aliasName, fileName, memberName, context);
   }   
}

function createTraceCodeCommonJs(aliasName: string, fileName: string, memberName: string, context: Context) {
      let code = `var ${aliasName};`;
      code = code + `
try 
{
   ${aliasName} = require(${fileName});
}
catch(err) 
{
   console.error("error requiring ${printableString(fileName)} in <${printableString(context.tagName)}>");
   console.error(err);
}
`;
   if(!memberName) 
   {
      code = code + `if(${aliasName}===undefined) console.error("require(${printableString(fileName)}) is undefined in <${printableString(context.tagName)}>");\r\n`;
   }
   else 
   {
      code = code + `${aliasName} = ${aliasName}.${memberName};\r\n`;
      code = code + `if(${aliasName}===undefined) console.error("require(${printableString(fileName)}).${printableString(memberName)} is undefined in <${printableString(context.tagName)}>");\r\n`;
   }
   return code;
}
