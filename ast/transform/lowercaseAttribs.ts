import _ = require("lodash");

import { astNode, rootNode, tagNode, visit } from "../nodeTypes";
import { splitBrackets } from "../../utils/brackets";
import { eventConversion, nativeHtmlTags } from "../../utils/react-events";

let reactSupportedAttributes = ['accept', 'acceptCharset', 'accessKey', 'action', 'allowFullScreen', 'allowTransparency', 'alt', 'async', 'autoComplete', 'autoPlay', 'cellPadding', 'cellSpacing', 'charSet', 'checked', 'classID', 'className', 'cols', 'colSpan', 'content', 'contentEditable', 'contextMenu', 'controls', 'coords', 'crossOrigin', 'data', 'dateTime', 'defer', 'dir', 'disabled', 'download', 'draggable', 'encType', 'form', 'formNoValidate', 'frameBorder', 'height', 'hidden', 'href', 'hrefLang', 'htmlFor', 'httpEquiv', 'icon', 'id', 'label', 'lang', 'list', 'loop', 'manifest', 'max', 'maxLength', 'media', 'mediaGroup', 'method', 'min', 'multiple', 'muted', 'name', 'noValidate', 'open', 'pattern', 'placeholder', 'poster', 'preload', 'radioGroup', 'readOnly', 'rel', 'required', 'role', 'rows', 'rowSpan', 'sandbox', 'scope', 'scrolling', 'seamless', 'selected', 'shape', 'size', 'sizes', 'span', 'spellCheck', 'src', 'srcDoc', 'srcSet', 'start', 'step', 'style', 'tabIndex', 'target', 'title', 'type', 'useMap', 'value', 'width', 'wmode'];
let classNameProp = 'className';
let attributesMapping = { 'class': classNameProp, 'rt-class': classNameProp, 'for': 'htmlFor' }; //eslint-disable-line quote-props

// create attribute translation map
reactSupportedAttributes.forEach(attributeReactName => {
   const lowerCaseName = attributeReactName.toLowerCase();
   if (attributeReactName !== lowerCaseName) {
      attributesMapping[lowerCaseName] = attributeReactName;
   }
});

export function transform_lowercase_attribs(node: astNode)
{  
   if(node.type === "tag")
   {
      // on events, for all tags
      Object.keys(node.attribs).forEach(key => parse_on_attribute(node, key, node.attribs[key].rawText));
      
      // attributes, only for supported native tags
      if(isNativeHtmlTag(node.tagName))
      {
         Object.keys(node.attribs).forEach(key => parse_lowercase_attribute(node, key, node.attribs[key].rawText));   
      }
   }
   
   visit(node, (n)=>transform_lowercase_attribs(n));
}

function isNativeHtmlTag(tag: string)
{
   if(nativeHtmlTags[tag]) return true;
   return false;
}

function parse_on_attribute(node: tagNode, attrib: string, value: string): void
{
   if(attrib.indexOf("on") !== 0) return;

   // replace lowercase name for known events
   let properName = eventConversion[attrib];
   if(properName) {
      node.attribs[properName] = { rawText: value, text: [] };
      delete node.attribs[attrib];
   }

   // TODO make it selectable via CLI option

   /*
   TODO ? filter brackets for unknown event handlers too ?
   // filter brackets for unknown event handlers too
   if(!known) {
      tag.attribs[attrib] = cleanBrackets(tag.attribs[attrib], context.brackets);  
   }
   */

   /*
   TODO? disabled automatic binding

      var handler = tag.attribs[attrib];

      // autobinds "this.funcName"
      if(handler.indexOf("(")!==0) {
         handler = wrapHandler(handler, context);
         handler = handler+".bind(this)";
         //handler = wrapExpression(handler, context, false);
         handler = "{" + handler + "}";
      }
   
      tag.attribs[attrib] = handler;

      return;
   }
   */

   // TODO event ending in "Capture" ("onClickCapure")
}

function parse_lowercase_attribute(node: tagNode, attrib: string, value: string): void
{
   // replace lowercase name for known attributes
   let properName = attributesMapping[attrib];
   if(properName) {
      node.attribs[properName] = { rawText: value, text: [] };
      delete node.attribs[attrib];
   }

   // TODO make it selectable via CLI option
   
   // TODO support specific react version?
}

