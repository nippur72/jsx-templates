import React = require("react");
import ReactDOMServer = require("react-dom/server");
          
import { webpack } from "../../webpack";
import { CommandLineOptions, defaultOptions } from "../../options";
import _eval = require("eval");

/**
 * Compiles a string template with rioct-cli and returns a callable react function
 *
 * @param template the input template string
 * @param options command line options to call rioct-cli with
 */

export function compileTemplate(template: string, options?: CommandLineOptions)
{
   options = options || defaultOptions();  
   const jsCode = webpack(template, options);  
   return _eval(jsCode, "eval", {}, true);
}

export function renderComponent(template: string, props?: any, options?: CommandLineOptions): string
{
   // suppress a react warning caused by _eval()
   const oldNODE_ENV = process.env.NODE_ENV;
   process.env.NODE_ENV = "production";

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
      throw new Error("failed to render component: " + err.message);
   }

   // restore warnings
   process.env.NODE_ENV = oldNODE_ENV;

   return s;
}

