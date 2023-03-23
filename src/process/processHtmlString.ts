import { CommandLineOptions } from "../utils/options";
import { htmlToTsx } from "../ast/astNode";

export function processHtmlString(html: string, options: CommandLineOptions, fileName: string): string
{   
   let tsx = htmlToTsx(html, options, fileName);
   return tsx;
}