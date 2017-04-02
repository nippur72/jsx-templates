import { rootNode, astNode } from "../nodeTypes";

import { transform_root_tag } from "./rootTag";
import { transform_style_tag } from "./styleTag";
import { transform_optional_brackets } from "./optionalBrackets";
import { transform_stateless } from "./stateless";
import { transform_is } from "./is";
import { transform_each } from "./each";
import { transform_if } from "./if";
import { transform_scope } from "./scope";
import { transform_class } from "./class";
import { transform_attribs } from "./attribs";
import { transform_text } from "./text";
import { transform_virtual } from "./virtual";
import { transform_import } from "./import";
import { transform_yield } from "./yield";
import { transform_script } from "./script";
import { transform_style_attrib } from "./styleAttribute";
import { transform_lowercase_attribs } from "./lowercaseAttribs";
import { transform_show_hide } from "./showHide";

export function transform(ast: rootNode)
{
   // root tag name
   transform_root_tag(ast);
   
   // handle style tags
   transform_style_tag(ast);

   // process (and removes) special attributes
   transform_optional_brackets(ast);   
   transform_stateless(ast);
   transform_if(ast);     
   transform_is(ast);
   transform_each(ast);   
   transform_scope(ast);  
   transform_class(ast);

   // special tags
   transform_virtual(ast);
   transform_import(ast);
   transform_yield(ast);
   transform_script(ast);

   // style attribute
   //transform_show_hide(ast);
   transform_style_attrib(ast);

   // onevents attributes
   transform_lowercase_attribs(ast);

   // process brackets   
   transform_attribs(ast);
   transform_text(ast);
      
   // props-ob => merge
   // TODO trimming in virtual node
   
   // ?? <include> 
   // rt-pre      
   // runtime check on event handlers, binding?
   // event handlers, binding?

   // template functions
   // modules output?
   // normalize whitespace
   // helper functions, mergeprops
   // --debug, --debug-strict
   // typescript
   // jsx/typescript output
   // error with line, column   
   // special html &nbsp; etc
   // improve jsstring in code

   // *** extra features:
   // ?? automatic key in each, or via switch, if?
   // plugins
   // keyword redefinition   
   // ?? <export>
   // template as props
   // TODO else, switch
   // TODO optimize single element array child in if,each,scope
   // import multiple names <import name="name as alias, ..." from="file" />
   // flag for outer components
   // style-ob
   // check special attributes clash with props

   // NEW TO DOCUMENT
   // <script> tag
   // solve <script> not working with tsx syntax
}

// utility function used in debug
function display_tree(ast: astNode, level: number, knownParent)
{
   let indent = ""; 
   for(let t=0; t<level; t++) indent += "  ";      

   if((ast as any).parent && (ast as any).parent != knownParent) indent += "*";

        if(ast.type === "root")  console.log(`${indent}${ast.type}`);
   else if(ast.type === "tag")   console.log(`${indent}${ast.type}(${ast.tagName})`);
   else if(ast.type === "code")  console.log(`${indent}${ast.type}`);
   else if(ast.type === "text")  console.log(`${indent}${ast.type}(${ast.rawText.trim()})`);
   else                          console.log(`${indent}${ast.type}`);

   if(ast.type === "tag" || ast.type === "code" || ast.type === "root")
   {
      ast.children.forEach(n => display_tree(n, level+1, ast));
   }
}

