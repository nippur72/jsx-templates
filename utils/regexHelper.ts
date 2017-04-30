export const digit = "\\d";
export const nonDigit = "\\D";
export const anychar = ".";
export const anyspace = "\\s";
export const anyNonSpace = "\\S";
export const newline = "\\n";
export const endOfLine = "$";
export const startOfLine = "^";

export function singleCharOf(c: string) 
{
   return `[${c}]`;
}

export function singleCharExcept(c: string) 
{
   return `[^${c}]`;
}

export function singleCharInRange(s: string, e: string) 
{
   return `[${s}-${e}]`;
}

export function singleCharNotInRange(s: string, e: string) 
{
   return `[^${s}-${e}]`;
}

export function capture(s: string) {
   return "("+s+")";
}

export function nonCapture(s: string) {
   return `(?:${s})`;
}

export function zeroOrOne(s: string) {
   return `(?:${s})?`;
}

export function zeroOrMore(s: string) {
   return `(?:${s})*`;
}

export function OneOrMore(s: string) {
   return `(?:${s})+`;
}

export function asFewAsPossible(s: string) {
   return `(?:${s})*?`;
}

export function exactly(s: string, n: number) {
   return `(?:${s}){${n}}`;
}

export function exactlyNOrMore(s: string, n: number) {
   return `(?:${s}){${n},}`;
}

export function exactlyBetween(s: string, n1: number, n2: number) {
   return `(?:${s}){${n1},${n2}}`;
}

export function or(...ops: string[]) {
   return ops.join("|");
}

export function text(s: string) {
   let result = "";
   for(let t=0;t<s.length;t++) {
      let c = s[t];
      switch(c) {
         case "\\": c = "\\\\"; break;
         case "^": c = "\\^"; break;
         case "$": c = "\\$"; break;
         case "(": c = "\\("; break;
         case ")": c = "\\)"; break;
         case "[": c = "\\["; break;
         case "]": c = "\\]"; break;
         case "{": c = "\\{"; break;
         case "}": c = "\\}"; break;
         case ".": c = "\\."; break;
         case "*": c = "\\*"; break;
         case "+": c = "\\+"; break;
         case "-": c = "\\-"; break;
         case "?": c = "\\?"; break;
         case "|": c = "\\|"; break;
      }
      result = result + c;
   }
   return result;
}

/*
export function matches(regex: RegExp, text: string) {
   let res: any[] = [];

   for (;;) {
        var match = regex.exec(text);
        if (match === null) {
            break;
        }
        if (match.index === regex.lastIndex) {
            regex.lastIndex++;
        }

        res.push(match);
    }

    return res;
}
*/