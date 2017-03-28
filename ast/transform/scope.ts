import { astNode, rootNode, codeNode, tagNode } from "../nodeTypes";
import { Keywords } from "../keywords";
import { replaceNode } from "./replaceNode";

export function transform_scope(node: astNode)
{   
   if(node.type === "tag")
   {
      let scopeAttrib = node.attribs[Keywords.scope];      
      if(scopeAttrib !== undefined) 
      {         
         let scopes: IScope[];
         try 
         {
            let value = scopeAttrib.rawText;
            scopes = parseScopeSyntax(value);
         } 
         catch (scopePart) 
         {
            throw `invalid scope part '${scopePart}'`;
         }

         delete node.attribs[Keywords.scope];

         let parentnode = node.parent;
         let scopeList = scopes.map(s=>`let ${s.identifier}=${s.expression};`).join("");

         if(parentnode === null || parentnode === undefined) {
            throw `${Keywords.scope} can't be placed in a root node`;
         }

         // prepares a code node
         let scopeNode: codeNode = 
         {
            type: "code",
            expression: `(()=>{${scopeList} return (%%%children%%%);})()`,
            children: [ node ],            
            parent: parentnode 
         };

         node.parent = scopeNode;

         replaceNode(parentnode as tagNode, node, scopeNode);
      }
   }
   
   if(node.type === "tag" || node.type === "code" || node.type === "root")
   {  
      node.children.forEach(n=>transform_scope(n));
   }
}

interface IScope
{
   identifier: string;
   expression: string;
}

// this is the function I wrote for [react-templates] (@nippur72)

/**
 * Parses the rt-scope attribute returning an array of parsed sections
 *
 * @param {String} scope The scope attribute to parse
 * @returns {Array} an array of {expression,identifier}
 * @throws {String} the part of the string that failed to parse
 */
function parseScopeSyntax(text: string): IScope[] {
    // the regex below was built using the following pseudo-code:
    // double_quoted_string = `"[^"\\\\]*(?:\\\\.[^"\\\\]*)*"`
    // single_quoted_string = `'[^'\\\\]*(?:\\\\.[^'\\\\]*)*'`
    // text_out_of_quotes = `[^"']*?`
    // expr_parts = double_quoted_string + "|" + single_quoted_string + "|" + text_out_of_quotes
    // expression = zeroOrMore(nonCapture(expr_parts)) + "?"
    // id = "[$_a-zA-Z]+[$_a-zA-Z0-9]*"
    // as = " as" + OneOrMore(" ")
    // optional_spaces = zeroOrMore(" ")
    // semicolon = nonCapture(or(text(";"), "$"))
    //
    // regex = capture(expression) + as + capture(id) + optional_spaces + semicolon + optional_spaces

    const regex = RegExp("((?:(?:\"[^\"\\\\]*(?:\\\\.[^\"\\\\]*)*\"|'[^'\\\\]*(?:\\\\.[^'\\\\]*)*'|[^\"']*?))*?) as(?: )+([$_a-zA-Z]+[$_a-zA-Z0-9]*)(?: )*(?:;|$)(?: )*", 'g');
    const res: IScope[] = [];
    do {
        const idx = regex.lastIndex;
        const match = regex.exec(text);
        if (regex.lastIndex === idx || match === null || match.index !== idx) {
            throw text.substr(idx);
        }
        if (match.index === regex.lastIndex) {
            regex.lastIndex++;
        }
        res.push({expression: match[1].trim(), identifier: match[2]});
    } while (regex.lastIndex < text.length);

    return res;
}

/*

// this is the old code from rioct-cli

import rh = require("./regexHelper");

export interface scopeItem 
{
   expression: string;
   identifier: string;
}

export function parseScope(s: string): scopeItem[]
{
   const double_quoted_string = `"[^"\\\\]*(?:\\\\.[^"\\\\]*)*"`; 
   const single_quoted_string = `'[^'\\\\]*(?:\\\\.[^'\\\\]*)*'`; 
   const text_out_of_quotes = `[^"']*?`;
   const expr_parts = rh.or(double_quoted_string, single_quoted_string, text_out_of_quotes);
   const expression = rh.zeroOrMore(rh.nonCapture(expr_parts))+"?";
   const id = "[$_a-zA-Z]+[$_a-zA-Z0-9]*";   
   const as = rh.text(" as") + rh.OneOrMore(" ");
   const optional_spaces = rh.zeroOrMore(" ");
   const semicolon = rh.nonCapture(rh.or(rh.text(";"), rh.endOfLine()));    

   const regex = rh.capture(expression) + as + rh.capture(id) + optional_spaces + semicolon + optional_spaces;

   const R = new RegExp(regex, "g");

   const result = buildResult(R, s);

   return result;
}


function buildResult(regex: RegExp, text: string): scopeItem[]
{
   const res: scopeItem[] = [];

   do {       
      const idx = regex.lastIndex;  
      const match = regex.exec(text);  
      //console.log(`text=${text} idx=${idx} regex.lastIndex=${regex.lastIndex} match.index=${match?match.index:''} match=${match}`);    
      if(regex.lastIndex===idx || match === null || match.index !== idx) {
         // did not match at the index, report as error
         throw text.substr(idx);
      }            
      if(match.index === regex.lastIndex) {
         regex.lastIndex++;
      }                                
      res.push({expression: match[1].trim(), identifier: match[2]});
   } while(regex.lastIndex < text.length)

   return res;
}
*/
