import { CommandLineOptions } from "../utils/options";
import { htmlToTsx } from "../ast/astNode";

export function processHtmlString(html: string, options: CommandLineOptions, fileName: string): string
{   
   let tsx = htmlToTsx(html, options, fileName); 

   return tsx;
   
   /*
   return "";

         try
         {
            results.push(processHtmlFile(fileName, options)) 
         }
         catch(ex)
         {
            allOk = false;
            if(ex instanceof CompileError) {
               var ce = ex as CompileError;
               console.log(`${ce.fileName}: ${ce.message}`);
               if(ce.loc)  console.log(`in line ${ce.loc.line} column ${ce.loc.col}`);
               if(ce.snip) console.log(`${ce.snip}`);
            }
            else {
               console.log(ex);
            }
         }  
   */
}