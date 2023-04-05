import { Keywords } from "./keywords";
import { astNode, rootNode, firstNode, tagNode, styleNode, commentNode, textNode, ifNode, virtualNode, scopeNode, templateNode, eachNode } from "./nodeTypes";
import { attributes, attribute, literal } from "./nodeTypes";
import { replaceAll } from "../utils/replaceAll";
import { wrapRenderFunction, wrapImport } from "./transform/debug";
import { printableString, quotableString } from "../utils/printable";

export function render(node: astNode): string
{
        if(node.type === "root")    return renderRoot(node);
   else if(node.type === "first")   return renderFirst(node);
   else if(node.type === "tag")     return renderTag(node);
   else if(node.type === "style")   throw "unexpected style node";
   else if(node.type === "comment") return renderComment(node);
   else if(node.type === "text")    return renderText(node);   
   else if(node.type === "if")      return renderIf(node);
   else if(node.type === "scope")   return renderScope(node);
   else if(node.type === "each")    return renderEach(node);
   else if(node.type === "template")return renderTemplate(node);
   else if(node.type === "virtual") return renderVirtual(node);
   else throw `unknown node type '${(node as astNode).type}'`;   
}

function renderRoot(node: rootNode): string
{
   // writes import statements
   let result = node.imports.join("\r\n");
   result += "\r\n";  

   if(node.options.debugRuntimeCheck) 
   {
      result += node.importedSymbols.map(s=>wrapImport(s, node.options)).join("\r\n");
   }

   // writes style-loading code
   result += node.styles.join("\r\n");
   if(node.styles.length>0) result += "\r\n";

   // writes code from <script> tags
   result += node.scripts.join("\r\n");
   result += "\r\n";  

   let childrenRender = node.children.map(n=>render(n));

   result = result + childrenRender.join("\r\n");

   return result;
}

function renderFirst(node: firstNode): string
{
   let result = "";

   // writes the actual render function
   let children = render(node.child);

   if(node.parent.options.debugRuntimeCheck) 
   {
      children = wrapRenderFunction(children, node.parent.options);
   }

   let exportPrefix = "";
   let exportName = "render";

        if(node.export === "named"  ) { exportPrefix = "export "; exportName = node.mainTagName; }
   else if(node.export === "default") exportPrefix += "export default ";
   else if(node.export === "private") { exportPrefix = ""; exportName = node.mainTagName; }

   if(node.stateless !== undefined) 
   {
      let propsType = node.stateless || "any";
      let argDef = `this: never, props: ${propsType}, context: unknown`;
      if(node.stateless.charAt(0)=="(") {
         argDef = node.stateless;
         argDef = argDef.substr(1);
         argDef = argDef.substr(0,argDef.length-1);
      }
      result += `${exportPrefix}function ${exportName}(${argDef}) { return (${children}); }\r\n`;
   }
   else
   {
      let type = node.thisUsed ? node.mainTagName : "any";
      result += `${exportPrefix}function ${exportName}(this: ${type}) { const {state,props}=this; return (${children}); }\r\n`;
   }

   if(node.export === "require") result += `export = ${exportName};`;
   return result;
}

function renderTag(node: tagNode): string
{
   let children = node.children.map(n=>render(n)).join("");
   let attribs = renderAttributes(node.attribs);
   let spacea = Object.keys(node.attribs).length>0 ? " " : "";
   let props = node.props.length > 0 ? printableExpression(node.props) : '';
   let spacep = node.props.length > 0 ? " " : "";
   let result = `<${node.tagName}${spacea}${attribs}${spacep}${props}>${children}</${node.tagName}>`;   
   return result;
}

function renderAttributes(attrs: attributes): string
{
   let array = Object.keys(attrs).map(key => `${key}=${renderAttribute(attrs[key])}`);
   return array.join(" ");
}

function renderAttribute(attr: attribute): string
{
   if(attr.text.length === 1 && attr.text[0].isString) {
      // simple case, constant string, return it as-is
      return `"${printableString(attr.text[0].text)}"`;
   }

   // complex case, it's a concatenated string expression
   return printableExpression(attr.text);
}

function renderComment(node: commentNode): string
{
   // do not render empty comments, used to gracefully remove nodes from the tree
   if(node.comment === "") return "";

   // TODO sanitize comments
   // return `{/* ${node.comment} */}`;

   // comments are disabled
   return "";   
}

function renderText(node: textNode): string
{
   if(node.parent.type === "tag")
   {
      let chained = node.text.map(e => e.isString ? e.text : `{${e.text}}`);
      return chained.join("");
   }
   else if(node.parent.type === "root") 
   {
      return ""; // any text at root level is ignored
   }
   else 
   {
      let chained = node.text.map(e => e.isString ? `"${quotableString(e.text)}"` : `${e.text}`);
      return chained.join(",");
   }
}

/*
function renderCode(node: codeNode): string
{
   let c = node.children.map(n=>render(n)).join(",");
   let expr = replaceAll(node.expression, "%%%children%%%", c); 
   if(node.parent.type === "tag") 
   {
      expr = `{${expr}}`;
   }
   return expr;
}
*/

function renderIf(node: ifNode): string
{
   let true_children  = node.true_children.length  == 0 ? "null" : node.true_children.map(n=>render(n)).join(",");
   let false_children = node.false_children.length == 0 ? "null" : node.false_children.map(n=>render(n)).join(",");
   
   let expr = `${node.condition}?${true_children}:${false_children}`;

   if(node.parent.type === "tag") 
   {
      expr = `{${expr}}`;
   }
   return expr;
}

function renderScope(node: scopeNode): string
{
   let c = node.children.map(n=>render(n)).join(",");
   let expr = `(()=>{${node.items} return (${c});})()`;
   if(node.parent.type === "tag") 
   {
      expr = `{${expr}}`;
   }
   return expr;
}

function renderEach(node: eachNode): string
{
   let c = node.children.map(n=>render(n)).join(",");
   let index = node.index !== "" ? `,${node.index}` : ``;
   let expr = `${node.collection}.map((${node.item}${index})=>[${c}])`;
   if(node.parent.type === "tag") 
   {
      expr = `{${expr}}`;
   }
   return expr;
}

function renderVirtual(node: virtualNode): string
{
   let children = node.children.map(n=>render(n)).filter(s=>s!=="");
   let cs = children.join(",");
   let expr = children.length === 1 ? `${cs}` : `[${cs}]`; 
   if(node.parent.type === "tag") 
   {
      expr = `{${expr}}`;
   }
   return expr;
}

function renderTemplate(node: templateNode): string
{
   let templateCode = node.templates.map(s => {
      let props = s.props === '' ? 'props' : 'props: ' + s.props;
      return `let ${s.name} = (${props})=>(${render(s.content)});`
   }).join("");

   let c = node.children.map(n=>render(n)).join(",");
   let expr = `(()=>{${templateCode} return (${c});})()`;
   if(node.parent.type === "tag") 
   {
      expr = `{${expr}}`;
   }
   return expr;
}

function indent(n: number)
{
   let s="";
   for(let t=0;t<n;t++) s += "   ";
   return s;
}

function printableExpression(expr: literal[])
{
   let array = expr.map(e => {
      if(e.isString) return `"${printableString(e.text)}"`; 
      else return `(${e.text})`;
   });

   let chained = array.join(" + ");

   return `{${chained}}`;
}
