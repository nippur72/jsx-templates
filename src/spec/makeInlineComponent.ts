import React = require("react");
import ReactDOMServer = require("react-dom/server");

import _eval = require("eval");
import * as ts from "typescript";

import { CommandLineOptions, defaultOptions } from "../utils/options";
import { processHtmlString } from "../process/processHtmlString";

export function compileTemplate(template: string, options?: CommandLineOptions): any
{
   options = options || defaultOptions(); 

   options.import_react = "import React = require('react');";
   
   let js;
   let tsx = processHtmlString(template, options, "nofile");

   try
   {      
      js = transpile(tsx);            
   }
   catch(ex)
   {
      console.log("**** tsx:");
      console.log(tsx);
      throw ex;
   }

   try
   {
      const evaluated = _eval(js, true) as any;
      if('default' in evaluated) return evaluated.default;   // returned as default
      return evaluated;                                      // returned as "require"
   }
   catch(ex)
   {
      console.log(`exception during eval():`,ex);
      console.log("**** tsx:");
      console.log(tsx);
      console.log("**** js:");
      console.log(js);
      console.log("****");
      throw ex;
   }
}

export function renderComponent(template: string, props?: any, options?: CommandLineOptions, suppressReactWarnings?: boolean): string
{
   // suppress a react warning caused by _eval()
   const oldNODE_ENV = process.env.NODE_ENV;
   process.env.NODE_ENV = suppressReactWarnings ? "production" : "debug"; 

   const fn = compileTemplate(template, options);
   const faked_this = { state: null, props: null };
   const component = React.createElement(fn.bind(faked_this), props);
   let s;

   try
   {      
      s = ReactDOMServer.renderToStaticMarkup(component);
   }
   catch(err)
   {
      //console.log(fn.toString());
      throw new Error("failed to render component: " + (err.message || err));
   }

   // restore warnings
   process.env.NODE_ENV = oldNODE_ENV;

   return s;
}

function transpile(source: string): string
{
   const compilerOptions: ts.CompilerOptions = { 
      module: ts.ModuleKind.CommonJS,
      target: ts.ScriptTarget.ES5,
      jsx: ts.JsxEmit.React,      
   };

   // source = "import React = require('react');" + source;

   let dia: ts.Diagnostic[] = []; 

   let trasnpiled = ts.transpile(source, compilerOptions, "file.tsx", dia, "testmodule");   

   return trasnpiled;
}

