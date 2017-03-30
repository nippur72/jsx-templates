import { astNode, rootNode, codeNode, tagNode, commentNode, textNode, attributes } from "../nodeTypes";
import { getRootNode } from "../astNode";
import { Keywords } from "../keywords";
import { replaceNode } from "./replaceNode";

export function transform_yield(node: astNode)
{   
   if(node.type === "tag")
   {
      if(node.tagName === Keywords.yield)
      {
         let isStateless = getRootNode(node).stateless;

         // change to text node
         (node as any).type = "text";
         (node as any as textNode).rawText = isStateless ? "{props.children}" : "{this.props.children}";

         // TODO <yield from, yield to>

         // TODO check no other attribs

         // TODO check no children
         
         /*
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
            imports.push(`import ${$require} = require("${from}");`);            
         }

         if(Object.keys(attribs).length !== 0) 
         {
            throw "extra unwanted attributes in import";
         }
         */       
      }
   }
   
   if(node.type === "tag" || node.type === "code" || node.type === "root")
   {  
      node.children.forEach(n => transform_yield(n));
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

