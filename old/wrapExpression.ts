import { CompileError } from "./CompileError";
import { getLine } from "./location";
import { printableString, printableRelativeFileName as file } from "./utils";
import { Context } from "./context";
import esprima = require("esprima");

function wrapAndApply(jsFunctionCode) {
   return `((${jsFunctionCode}).apply(this))`;   
}

function wrapTextExpression(jsCode: string, context: Context)
{  
   const wrongType = context.options.checkUndefined ?
      "$expr !== null && typeof $expr !== 'string' && typeof $expr !== 'number'" :
      "$expr !== null && typeof $expr !== 'string' && typeof $expr !== 'number' && typeof $expr !== 'undefined'" ;
      
   var fn =`function() { 
               try {
                  var $expr = (${jsCode})
                  if(${wrongType}) {
                     console.error("runtime error when evaluating: ${printableString(jsCode)}\\nin file: '${file(context.file)}', line ${context.line}, col ${context.column}\\nexpression must be of type 'string' or 'number', instead is '"+(typeof $expr)+"'")
                  }
                  return $expr
               }
               catch(ex) {                     
                  console.error("runtime error when evaluating: ${printableString(jsCode)}\\nin file: '${file(context.file)}', line ${context.line}, col ${context.column}\\n" + ex.message)
                  return '???'
               }
            }`;
   return wrapAndApply(fn);
}

function wrapGenericExpression(jsCode: string, context: Context) 
{   
   const wrongCheck = context.options.checkUndefined ? 
`
                  if(typeof $expr === 'undefined') {
                     console.error("runtime error when evaluating: ${printableString(jsCode)}\\nin file: '${file(context.file)}', line ${context.line}, col ${context.column}\\nexpression must be of type 'string' or 'number', instead is '"+(typeof $expr)+"'")
                  }
` : '';

   let fn =`function() { 
               try {
                  var $expr = (${jsCode})
                  ${wrongCheck}
                  return $expr
               }
               catch(ex) {                     
                  console.error("runtime expression error when evaluating: ${printableString(jsCode)}\\nin file: '${file(context.file)}', line ${context.line}, col ${context.column}\\nerror: " + ex.message)
                  return undefined
               }
            }`;

   // newlines are necessary: code can't use ";" because of "scope" syntax,
   // that can be changed once https://github.com/wix/react-templates/pull/176 is merged

   return wrapAndApply(fn).split("\n").join("\n");  
}

/**
 * Syntatically checks a javascript expression and 
 * optionally wraps it in a debug wrapper function 
 * for runtime error tracing
 * 
 * @param jsCode the javascript code as a string
 * @param context
 * @param isTextExpression when true the expression is additionally checked to be string or num
 */

export function wrapExpression(jsCode: string, context: Context, isTextExpression?: boolean): string {
   var expr = jsCode;  
   
   if(context.options.trace) {
      // special case of <yield> tag
      if(jsCode==="this.props.children" || jsCode==="props.children") isTextExpression = false;

      expr = isTextExpression === true ? wrapTextExpression(jsCode, context) : wrapGenericExpression(jsCode, context);
   }

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

   return expr;
}
