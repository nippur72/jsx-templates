import React = require("react");
import ReactDOMServer = require("react-dom/server");

import _eval = require("eval");
import * as ts from "typescript";

import { CommandLineOptions, defaultOptions } from "../utils/options";
import { processHtmlString } from "../process/processHtmlString";

import Rioct = require("rioct"); // for <style> rendering 

export function compileTemplate(template: string, options?: CommandLineOptions): string
{
   options = options || defaultOptions(); 
   
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
      const evaluated = _eval(js, "eval", {}, true);
      return evaluated;
   }
   catch(ex)
   {
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
   const component = React.createElement(fn, props);
   let s;

   try
   {      
      s = ReactDOMServer.renderToStaticMarkup(component);
   }
   catch(err)
   {
      console.log(fn.toString());
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

   let dia: ts.Diagnostic[] = []; 

   let trasnpiled = ts.transpile(source, compilerOptions, "file.tsx", dia, "testmodule");   

   return trasnpiled;
}

