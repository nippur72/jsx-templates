import { replaceAll } from "./replaceAll";

export function wrapCodeCommonJs(js: string, trace: boolean, tagName: string, isStateless: boolean) 
{      
   var p = "module.exports = ";
   var x = js.indexOf(p);

   if(x==-1) {
      console.log(js);
      throw "error extracting from JavaScript code";         
   }

   var before = js.substring(0, x);
   var func   = js.substr(x+p.length);      

   let stateless = isStateless ? "props, context" : "";

   if(trace) {   
      return before +
`var old_render = ${func}
var render = function (${stateless}) { 
   try 
   {       
      return old_render.apply(this,arguments) 
   } 
   catch(ex) 
   { 
      console.error("<${tagName}> runtime render() error:")
      console.error(ex)
      console.error(this)
   } 
};
module.exports = render;`;
   }
   else
   {
      return before +
`
var render = ${func}
module.exports = render;`;
   }
}

export function wrapCodeTypeScript(js: string, trace: boolean, tagName: string, isStateless: boolean) 
{      
   var p = "export = ";
   var x = js.indexOf(p);

   if(x==-1) {
      console.log(js);
      throw "error extracting from TypeScript code";         
   }

   var before = js.substring(0, x);
   var func   = js.substr(x+p.length);              

   let args: string[] = [];

   if(!isStateless) {
      args.push("this: component");
   }

   if(isStateless) {
      func = replaceAll(func, "function(props, context)", "function(props: component, context)");
      args.push("props: component", "context");
   }

   if(!isStateless) {
      // func = `function (${args.join(", ")})` + func.substr(func.indexOf(")")+1);
      func = replaceAll(func, "function()", `function(${args.join(", ")})`);

      const r = /(function [$_a-zA-Z]+[$_a-zA-Z0-9]*)\((.+)\)/g;
      func = func.replace(r, "$1(this: component, $2)");

      const r1 = /(function [$_a-zA-Z]+[$_a-zA-Z0-9]*)\(()\)/g;
      func = func.replace(r1, "$1(this: component)");
   }   

   const r2 = /(_\.transform\()/g;
   func = func.replace(r2, "_.transform<{},string|undefined>(");

   before = before + `\nimport component from './${tagName}';\n`;   

   if(trace) {   
      return before +
`const old_render = ${func}
const render = function (${args.join(", ")}) 
{ 
   try 
   {       
      return old_render.apply(this,arguments) 
   } 
   catch(ex) 
   { 
      console.error("<${tagName}> runtime render() error:")
      console.error(ex)
      console.error(this)
   } 
};
export = render;`;
   }
   else
   {
      return before +
`
var render = ${func}
export = render;`;
   }
}
