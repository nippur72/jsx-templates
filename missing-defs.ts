declare interface reactTemplates {
   convertTemplateToReact: (html, options) => string,
   convertRT: (html, reportContext, options) => string,
   //convertJSRTToJS: any,
   RTCodeError: any
}

// extend CheerioElement as default .d.ts 
// doesn't support startIndex

interface CheerioElement {
   startIndex: number;
}

interface CheerioOptionsInterface {
   withStartIndices?: boolean;
}

declare module "react-templates/src/reactTemplates" {
   var rt: reactTemplates;
   export = rt;
}

declare module "camelcase" {
   function camelcase(s);
   export = camelcase;
}

declare module "pascalcase" {
   function pascalcase(s);
   export = pascalcase;
}

declare module "decamelize" {
   function decamelize(s);
   export = decamelize;
}

declare module "optionator" {
   var optionator: any;
   export = optionator;
}

declare module "escodegen" {
   var escodegen: any;
   export = escodegen;
}

declare module "blueimp-md5" {
   function md5(value: string, key: string): string;
   export = md5;
}
                                  
declare module "react-dom/server" {
   export function renderToString(c: any): string;   
   export function renderToStaticMarkup(c: any): string;   
}


declare module "eval" {
   function eval(s: string, fileName?:string, scope?: any, includeGlobals?: boolean): any;
   export = eval;
}

declare module "react-style-tag/lib/transform" {
   export function minify(css: string): string;
   export function prefixCss(css: string): string;
}