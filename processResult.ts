export const LibName = "Rioct";

import { minify, prefixCss } from "react-style-tag/lib/transform";

export class processResult {
   tagName: string;
   functionName: string;
   extractedStyle: string = "";
   rtTemplate: string;
   rtTemplateAugumented: string;
   rtSource: string;
   fileName: string;
   outName: string;

   jsxResult: string;

   registerTag() {
      return `${LibName}.tags["${this.tagName}"] = render;`;
   }

   styleCommand(trace: boolean) {
      if(this.extractedStyle) return `${LibName}.styles.push(${this.sanitizeStyle(this.extractedStyle, trace)}); ${LibName}.updateStyles();`;
      else return "";
   }

   importRioct() {
      return `var ${LibName} = require('rioct');`;
   }

   sanitizeStyle(style: string, trace: boolean): string {
      let compactStyle: string;

      const prefixed = prefixCss(style);
      
      if(trace) {
         compactStyle = `/*** styles local to tag <${this.tagName}> ***/\r\n\r\n` + prefixed;
      }
      else {
         //compactStyle = prefixed.split('\n').map(item=>item.trim()).join(' ').split('\r').map(item=>item.trim()).join(' ');      
         compactStyle = minify(prefixed);
      }
      return JSON.stringify(compactStyle);
   }
}

   