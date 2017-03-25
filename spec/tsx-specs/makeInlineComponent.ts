import React = require("react");
import ReactDOMServer = require("react-dom/server");
          
import { webpack } from "../../webpack";
import { CommandLineOptions, defaultOptions } from "../../options";
import _eval = require("eval");

import { parseFromString } from "../../ast/astNode";

/**
 * Compiles a string template with rioct-cli and returns a callable react function
 *
 * @param template the input template string
 * @param options command line options to call rioct-cli with
 */

export function compileTemplate(template: string)
{
   // options = options || defaultOptions(); 
   
   let jsCode = parseFromString(template);
   const evaluated = _eval(jsCode, "eval", {}, true);
   return evaluated;
}

export function renderComponent(template: string, props?: any): string
{
   // suppress a react warning caused by _eval()
   const oldNODE_ENV = process.env.NODE_ENV;
   process.env.NODE_ENV = "debug"; //"production";

   const fn = compileTemplate(template);
   const component = React.createElement(fn, props);
   let s;

   try
   {      
      s = ReactDOMServer.renderToStaticMarkup(component);
   }
   catch(err)
   {
      console.log(fn.toString());
      throw new Error("failed to render component: " + err.message);
   }

   // restore warnings
   process.env.NODE_ENV = oldNODE_ENV;

   return s;
}

