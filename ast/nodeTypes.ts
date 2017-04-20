import { CommandLineOptions } from "../utils/options";
import { Brackets } from "../utils/brackets";
    
export type astNode = rootNode    | 
                      tagNode     | 
                      styleNode   | 
                      scriptNode  | 
                      commentNode | 
                      textNode    |                       
                      ifNode      | 
                      scopeNode   |
                      eachNode    |
                      templateNode|
                      virtualNode;

export interface rootNode
{
   type: "root";
   stateless: string|undefined;
   children: astNode[];
   imports: string[];
   styles: string[];
   scripts: string[];
   hash: string;
   mainTagName: string;
   options: CommandLineOptions;
   source: {
      html: string;   
      fileName: string;
   },   
   brackets: Brackets;
   thisUsed: boolean;
   importedSymbols: string[];
}

export interface tagNode
{
   type: "tag";
   tagName: string;
   attribs: attributes;
   children: astNode[];
   parent: astNode;
   location: number;
   indent: number;
   props: literal[];
}

export interface textNode
{
   type: "text";
   rawText: string;
   text: literal[];
   parent: astNode;
   location: number;
}

export interface styleNode
{
   type: "style";
   style: string;
   parent: astNode;
   location: number;
}

export interface scriptNode
{
   type: "script";
   script: string;
   parent: astNode;
   location: number;
}

export interface commentNode
{
   type: "comment";
   comment: string;
   parent: astNode;
   location: number;
}

export interface ifNode
{
   type: "if";   
   contidion: string;
   true_children: astNode[];
   false_children: astNode[];
   parent: astNode;
}

export interface scopeNode
{
   type: "scope";   
   items: string;
   children: astNode[];
   parent: astNode;
}

export interface eachNode
{
   type: "each";   
   collection: string;
   item: string;
   index: string;
   children: astNode[];
   parent: astNode;
}

export interface ITemplate
{
   name: string;
   props: string;
   content: astNode;
}

export interface templateNode
{
   type: "template";      
   templates: ITemplate[];
   children: astNode[];
   parent: astNode;
}

export interface virtualNode
{
   type: "virtual";      
   children: astNode[];
   parent: astNode;
}

export type attributes = { [key:string]: attribute };

export interface attribute 
{
   rawText: string;
   text: literal[];
}

export interface literal 
{
   text: string;
   isString: boolean;
   startIndex: number;
}

type caller = (n: astNode, root?: rootNode) => void;

export function visit(node: astNode, c: caller)
{
   if(node.type === "tag" || node.type === "root" || node.type === "virtual" || node.type === "scope" || node.type === "each")
   {  
      node.children.forEach(n => c(n));
   }  
   else if(node.type === "if")
   {
      node.true_children.forEach(n => c(n));
      node.false_children.forEach(n => c(n));
   }
   else if(node.type === "template")
   {
      node.children.forEach(n => c(n));
      node.templates.forEach(t => c(t.content));
   }
}