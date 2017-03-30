export type nodeTypes = "tag" | "style" | "script" | "comment" | "text" | "code" ;

export type astNode = rootNode | tagNode | styleNode | scriptNode | commentNode | textNode | codeNode;

export interface rootNode
{
   type: "root";
   stateless: boolean;
   children: astNode[];
   imports: string[];
   styles: string[];
   scripts: string[];
   hash: string;
   mainTagName: string;
}

export interface tagNode
{
   type: "tag";
   tagName: string;
   attribs: attributes;
   children: astNode[];
   parent: astNode;
   location: number;
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

export interface codeNode
{
   type: "code";   
   expression: string;
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
}
