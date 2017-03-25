/*
import _ = require("lodash");

import { Brackets, jsString, splitBrackets } from "./utils";

export class Emitter
{
   emit(rootNode: CheerioStatic): string
   {
      // return "() { throw 'not yet implemented'; }";
      var rootTags = _.filter(rootNode.root()[0].children, node => node.type === 'tag' || node.type === 'style');

      var root = rootTags[0] as CheerioElement;

      var render = this.renderNode(root);

      return `() { return ${render} }`;
   }

   renderNode(node: CheerioElement): string {
           if(node.type === "text") return this.renderText(node);
      else if(node.type === "tag")  return this.renderTag(node);
      else return "";
   }

   renderTag(node: CheerioElement): string {

      var element = node.name;

      if(this.isNativeElement(element)) {
         element = `'${element}'`;   
      }

      var props = "{}";

      var childrenArray = _.map(node.children, child => {
         return this.renderNode(child);         
      });

      var children = childrenArray.length === 0 ? "null" : childrenArray.join(', ');

      var expr = `React.createElement(${element}, ${props}, ${children})`;

      // wrap around rt-if
      if(node.attribs && node.attribs["rt-if"]) {
         var ifExpr = node.attribs["rt-if"];         

         expr = `(${ifExpr} ? ${expr} : null)`;
      }

      return expr;
   }

   renderText(node: CheerioElement): string {
      var text = node["data"];

      var brackets: Brackets = { open: "{", close: "}" };

      var r = splitBrackets(text, brackets);

      if(r===null) {
         throw `Failed to parse brackets on '${text}'`;
      }

      var textArr = _.map(r, el => {
         if(el.isJs) return el.text;
         else return jsString(el.text);
      });

      return textArr.join(",");
   }

   isNativeElement(el: string) {
      // TODO
      return true;
   }
}
*/
