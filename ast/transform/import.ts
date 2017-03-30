import { astNode, rootNode, codeNode, tagNode, commentNode, attributes } from "../nodeTypes";
import { getRootNode } from "../astNode";
import { Keywords } from "../keywords";
import { replaceNode } from "./replaceNode";

export function transform_import(node: astNode)
{   
   if(node.type === "tag")
   {
      if(node.tagName === Keywords.import)
      {
         let attribs = node.attribs;

         let imports = getRootNode(node).imports;

         // TODO does not allow other attributes on the <import> tag

         // TODO allow import only on the first level node

         // TODO verify Identifier syntax

         let from = getAndRemove(attribs, "from");

         if(from === undefined) 
         {
            throw `from attribute not specified in import`;
         }
         
         let name = getAndRemove(attribs, "name");
         if(name) 
         {
            let alias = getAndRemove(attribs, "as");            
            let aliaspart = alias ? ` as ${alias}` : ``;
            imports.push(`import { ${name}${aliaspart} } from "${from}";`);            
         }

         let all = getAndRemove(attribs, "all");
         if(all !== undefined) 
         {  
            let alias = getAndRemove(attribs, "as");            
            if(alias === undefined)
            {
               throw `alias attribute required in import all`;
            }            
            imports.push(`import * as ${alias} from "${from}";`);            
         }

         let $default = getAndRemove(attribs, "default");
         if($default) 
         {            
            imports.push(`import ${$default} from "${from}";`);            
         }

         let $require = getAndRemove(attribs, "require");
         if($require) 
         {       
            let how = /\.html?$/.test(from) ? 'var' : 'import';
            imports.push(`${how} ${$require} = require("${from}");`);            
         }

         if(Object.keys(attribs).length !== 0) 
         {
            throw "extra unwanted attributes in import";
         }
         
         // change to comment node
         (node as any).type = "comment";
         (node as any as commentNode).comment = "";
      }
   }
   
   if(node.type === "tag" || node.type === "code" || node.type === "root")
   {  
      node.children.forEach(n => transform_import(n));
   }
}

function getAndRemove(attribs: attributes, attr: string): string|undefined
{
   if(attribs[attr] === undefined) return undefined;

   const result = attribs[attr].rawText;
   delete attribs[attr];
   return result;
}

/*
   <import name="name" as="alias" from="file" />   
   <import name="*" as="alias" from="file" />
   <import all as="alias" from="file" />
   <import default="name" from="file" />
   <import require="name" from="file" />   

   // replace import with rt-import
   if(tag.name === "import") {
      tag.name = "rt-import";
      if(tag.attribs["default"]) {
         tag.attribs["name"] = "default";         
         tag.attribs["as"] = tag.attribs["default"];         
         delete tag.attribs["default"];
      }
      else if(tag.attribs["require"]) {
         tag.attribs["name"] = "*";         
         tag.attribs["as"] = tag.attribs["require"];         
         delete tag.attribs["require"];
      }
   }
*/

