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

