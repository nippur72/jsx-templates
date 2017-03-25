import { astNode, rootNode, virtualNode, tagNode } from "../nodeTypes";
import { Keywords } from "../astNode";
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
             scopes = parseScopeSyntax(scopeAttrib);
         } 
         catch (scopePart) 
         {
            throw `invalid scope part '${scopePart}'`;
         }

         delete node.attribs[Keywords.scope];

         let parentnode = node.parent;
         let scopeList = scopes.map(s=>`let ${s.identifier}=${s.expression};`).join("");

         // prepares a virtual node
         let ifNode: virtualNode = 
         {
            type: "virtual",
            expression: `{(()=>{${scopeList} return %%%children%%%;})()}`,
            children: [ node ],
            parent: parentnode 
         };

         if(parentnode === null || parentnode === undefined) {
            throw `${Keywords.scope} can't be placed in a root node`;
         }

         replaceNode(parentnode as tagNode, node, ifNode);
      }
   }
   
   if(node.type === "tag" || node.type === "virtual" || node.type === "root")
   {  
      node.children.forEach(n=>transform_scope(n));
   }
}

interface IScope
{
   identifier: string;
   expression: string;
}

/**
 * Parses the rt-scope attribute returning an array of parsed sections
 *
 * @param {String} scope The scope attribute to parse
 * @returns {Array} an array of {expression,identifier}
 * @throws {String} the part of the string that failed to parse
 */
function parseScopeSyntax(text): IScope[] {
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


