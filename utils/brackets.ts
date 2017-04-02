//import _ = require("lodash");

//import * as rh from "./regexHelper";


//// default "{" and "}" brackets are processed differently because they
//// are also valid JavaScript characters (block delimiters or object constant)
//// so brackets nesting has to be taken into account.
//// the function "convertText" below is an adapted version from react-templates 0.5.2

//export function replaceBrackets(text: string, context: Context, isTextExpression?: boolean): string 
//{
//   if(context.brackets.open === "{" && context.brackets.close === "}")
//   {
//      return replaceDefaultBrackets(text, context, isTextExpression);
//   } 
//   else
//   {
//      return replaceCustomBrackets(text, context, isTextExpression);
//   } 
//}

//export function replaceCustomBrackets(text: string, context: Context, isTextExpression?: boolean): string {

//    const bracket = context.brackets;

//    let res: string[] = [];

//    // TODO fails to replace {{serverInfo.databaseName ? serverInfo.databaseName : '<non connesso>'}}

//    const regex = new RegExp('([\\s\\S]*?)' + rh.text(bracket.open) + '([\\s\\S]*?)' + rh.text(bracket.close) + '([\\s\\S]*?)|([\\s\\S]*)', 'g');

//    // a syntax error might capture delimiters, so we check it
//    const badCaptured = new RegExp('(' + rh.text(bracket.open) + ')|(' + rh.text(bracket.close) + ')');

//    for (;;) {
//        var match = regex.exec(text);
//        if (match === null) {
//            break;
//        }
//        if (match.index === regex.lastIndex) {
//            regex.lastIndex++;
//        }

//        // check for bad captured delimiters
//        var error = match[1] !== undefined && badCaptured.test(match[1]) ||
//                    match[3] !== undefined && badCaptured.test(match[3]) ||
//                    match[4] !== undefined && badCaptured.test(match[4]);

//        if (error) {
//            throw new CompileError(`Failed to replace brackets in`,
//                                    context.file, 
//                                    getLine(context.html, context.tag), 
//                                    text);            
//        }
        
//        if (match[1]) res.push(match[1]); 
//        if (match[2]) res.push("{" + wrapExpression(match[2], context, isTextExpression) + "}"); 
//        if (match[3]) res.push(match[3]); 
//        if (match[4]) res.push(match[4]); 
//    }

//    return res.join('');
//}

//export function replaceDefaultBrackets(text: string, context: Context, isTextExpression?: boolean): string 
//{
//   return convertText(text, context, isTextExpression);
//}

//function convertText(text: string, context: Context, isTextExpression?: boolean) {
//    const curlyMap = {'{': 1, '}': -1};

//    let res = "";
//    let txt = text;
//    let first = true;    

//    while (_.includes(txt, '{')) {
//        const start = txt.indexOf('{');
//        const pre = txt.substr(0, start);
//        if (pre) {
//            res += pre;
//            first = false;
//        }
//        let curlyCounter = 1;
//        let end = start;
//        while (++end < txt.length && curlyCounter > 0) {
//            curlyCounter += curlyMap[txt.charAt(end)] || 0;
//        }
//        if (curlyCounter === 0) {
//            const needsParens = start !== 0 || end !== txt.length - 1;
//            const textPart = txt.substr(start + 1, end - start - 2);
//            res += "{" + wrapExpression(textPart, context, isTextExpression) + "}"
//            first = false;
//            txt = txt.substr(end);
//        } else {
//            throw new CompileError(`Failed to replace brackets in`,
//                                    context.file, 
//                                    getLine(context.html, context.tag), 
//                                    text);            
//        }
//    }
//    if (txt) {
//        res += txt;
//    }
//    return res;
//}
 


/**************/

import * as rh from "./regexHelper";

import { literal } from "../ast/nodeTypes";

export interface Brackets {
   open: string;
   close: string;
}

export function splitBrackets(text: string): literal[] 
{
    const bracket = { open: "{{", close: "}}" };

    let res: literal[] = [];

    // TODO fails to replace {{serverInfo.databaseName ? serverInfo.databaseName : '<non connesso>'}}

    const regex = new RegExp('([\\s\\S]*?)' + rh.text(bracket.open) + '([\\s\\S]*?)' + rh.text(bracket.close) + '([\\s\\S]*?)|([\\s\\S]*)', 'g');

    // a syntax error might capture delimiters, so we check it
    const badCaptured = new RegExp('(' + rh.text(bracket.open) + ')|(' + rh.text(bracket.close) + ')');

    for (;;) {
        var match = regex.exec(text);
        if (match === null) {
            break;
        }
        if (match.index === regex.lastIndex) {
            regex.lastIndex++;
        }

        // check for bad captured delimiters
        var error = match[1] !== undefined && badCaptured.test(match[1]) ||
                    match[3] !== undefined && badCaptured.test(match[3]) ||
                    match[4] !== undefined && badCaptured.test(match[4]);

        if (error) {
            throw `Failed to replace brackets in ${text}`;
        }
        
        if (match[1]) res.push({ text: match[1], isString: true  }); 
        if (match[2]) res.push({ text: match[2], isString: false }); 
        if (match[3]) res.push({ text: match[3], isString: true  }); 
        if (match[4]) res.push({ text: match[4], isString: true  }); 
    }

    return res;
}

/**
 * Makes brackets optional for special attributes
 * by simply eliminating them if present,
 * e.g. <div if="{{true}}"> is turned into <div if="{{true}}">
 */

export function removeOptionalBrackets(text: string, bracket: Brackets): string 
{  
    const anytext = rh.capture("[\\s\\S]*?");
    const regex = new RegExp(rh.startOfLine() + rh.text(bracket.open) + anytext + rh.text(bracket.close) + rh.endOfLine(), 'g');

    const match = regex.exec(text);

    if(match === null) return text;
    if(match[1]) return match[1];
    return "";
}

export function parseBracketCliOption(cliOption: string): Brackets
{
   const s = cliOption.split(' ');
   if(s.length !== 2) {
      throw "invalid brackets";
   }

   return {
      open: s[0],
      close: s[1]
   };
}
