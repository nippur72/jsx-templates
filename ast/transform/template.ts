import { astNode, rootNode, codeNode, tagNode, commentNode } from "../nodeTypes";
import { Keywords } from "../keywords";
import { replaceNode } from "./replaceNode";
import { render } from "../render";

export function transform_template(node: astNode)
{  
   // visit first
   if(node.type === "tag" || node.type === "code" || node.type === "root")
   {  
      node.children.forEach(n=>transform_template(n));
   }

   if(node.type === "tag")
   {
      let extracted_templates = node.children.map(n=>extract(n)).filter(t=>t !== undefined);

      if(extracted_templates.length > 0)
      {  
         // TODO ? check if can be placed in root node
         
         let parentnode = node.parent;         

         let filtered = extracted_templates as ITemplate[];         

         let templateCode = filtered.map(s => {
            let props = s.props === '' ? 'props' : 'props: ' + s.props;
            return `let ${s.name} = (${props})=>(${s.content});`
         }).join("");

         // prepares a code node
         let scopeNode: codeNode = 
         {
            type: "code",
            expression: `(()=>{${templateCode} return (%%%children%%%);})()`,
            children: [ node ],            
            parent: parentnode 
         };

         node.parent = scopeNode;

         replaceNode(parentnode as tagNode, node, scopeNode);
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

      let result: ITemplate =
      {
         name: componentName,
         props: propsType,
         content: render(n.children.filter(n=>n.type === "tag")[0])
      };

      // turn it into comment node
      (n as any).type = "comment";
      (n as any as commentNode).comment = "";

      return result;
   }

   return undefined;
}

interface ITemplate
{
   name: string;
   props: string;
   content: string;
}

