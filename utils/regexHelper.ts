export function capture(s: string) {
   return "("+s+")";
}

export function nonCapture(s: string) {
   return "(?:"+s+")";
}

export function zeroOrOne(s: string) {
   return "(?:"+s+")?";
}

export function zeroOrMore(s: string) {
   return "(?:"+s+")*";
}

export function OneOrMore(s: string) {
   return "(?:"+s+")+";
}

export function startOfLine() {
   return "^";
}

export function endOfLine() {
   return "$";
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