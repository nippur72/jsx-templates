import { astNode, rootNode, tagNode, commentNode, visit, templateNode, ITemplate } from "../nodeTypes";
import { Keywords } from "../keywords";
import { replaceNode } from "./replaceNode";
import { render } from "../render";

export function transform_template(node: astNode)
{  
   // visit first
   visit(node, (n)=>transform_template(n));

   // collect templates in children
   let extracted_templates: ITemplate[] = [];

   visit(node, n => 
   {
      let e = extract(n);
      if(e !== undefined) extracted_templates.push(e);      
   });
         
   if(node.type !== "root")
   {
      if(extracted_templates.length > 0)
      {  
         // TODO ? check if can be placed in root node
         
         let parentnode = node.parent;         

         // prepares a code node
         let newNode: templateNode = 
         {
            type: "template",
            templates: extracted_templates,
            children: [ node ],            
            parent: parentnode 
         };

         node.parent = newNode;

         replaceNode(parentnode, node, newNode);
      }
   }   
}

function extract(n: astNode): ITemplate | undefined
{
   if(n.type === "tag" && n.tagName === Keywords.template)
   {
      let componentName = n.attribs["name"] && n.attribs["name"].rawText;
      if(!componentName) {
         throw `template name must be specified`;
      }

      // TODO check must be identifier

      // TODO check must start upper case

      // TODO must have a single children

      let propsType = n.attribs["props"] ? n.attribs["props"].rawText : '';      

      let firstTag = n.children.filter(n=>n.type === "tag")[0];
      if(firstTag === undefined)
      {
         throw `template must have a simple direct child`;
      }

      let result: ITemplate =
      {
         name: componentName,
         props: propsType,
         content: firstTag
      };

      // turn into comment node
      (n as any).type = "comment";

      return result;
   }

   return undefined;
}


