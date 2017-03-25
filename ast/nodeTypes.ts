
export type attributes = { [key:string]:string };

export type nodeTypes = "tag" | "style" | "comment" | "text" | "virtual" ;

export type astNode = rootNode | tagNode | styleNode | commentNode | textNode | virtualNode;

export interface rootNode
{
   type: "root";
   children: astNode[];
}

export interface tagNode
{
   type: "tag";
   tagName: string;
   attribs: attributes;
   children: astNode[];
   parent: astNode;
}

export interface textNode
{
   type: "text";
   text: string;
   parent: astNode;
}

export interface styleNode
{
   type: "style";
   style: string;
   parent: astNode;
}

export interface commentNode
{
   type: "comment";
   comment: string;
   parent: astNode;
}

export interface virtualNode
{
   type: "virtual";   
   expression: string;
   children: astNode[];
   parent: astNode;
}

