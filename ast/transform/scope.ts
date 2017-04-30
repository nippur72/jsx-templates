import { astNode, rootNode, scopeNode, tagNode, visit } from "../nodeTypes";
import { Keywords } from "../keywords";
import { replaceNode } from "./replaceNode";
import rh = require("../../utils/regexHelper");

export function transform_scope(node: astNode)
{   
   visit(node, (n)=>transform_scope(n));

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
         let newNode: scopeNode = 
         {
            type: "scope",
            items: scopeList, 
            children: [ node ],            
            parent: parentnode 
         };

         node.parent = newNode;

         replaceNode(parentnode, node, newNode);
      }
   }      
}

interface IScope
{
   identifier: string;
   expression: string;
}

export function parseScopeSyntax(text: string): IScope[] 
{
   const double_quoted_string = `"[^"\\\\]*(?:\\\\.[^"\\\\]*)*"`; 
   const single_quoted_string = `'[^'\\\\]*(?:\\\\.[^'\\\\]*)*'`;     
   const text_out_of_quotes = `[^"']*?`;
   const expr_parts = rh.or(double_quoted_string, single_quoted_string, text_out_of_quotes);
   const naked_expression = rh.zeroOrMore(rh.nonCapture(expr_parts))+"?";
   const id = "[$_a-zA-Z]+[$_a-zA-Z0-9]*";   
   const as_keyword = rh.text(" as") + rh.OneOrMore(" ");
   const optional_spaces = rh.zeroOrMore(" ");
   const semicolon = rh.nonCapture(rh.or(rh.text(";"), rh.endOfLine)); 
   const parens_expression = rh.text("(") + naked_expression + rh.text(")");
   
   const expression = rh.or(naked_expression, parens_expression);

   const regex = rh.capture(expression) + as_keyword + rh.capture(id) + optional_spaces + semicolon + optional_spaces;

   const R = new RegExp(regex, "g");

   const result = buildResult(R, text);

   return result;
}


function buildResult(regex: RegExp, text: string): IScope[]
{
   const res: IScope[] = [];

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

