export function ltrim(stringToTrim: string): string
{
	return stringToTrim.replace(/^\s+/,"");
}

export function rtrim(stringToTrim: string): string 
{
	return stringToTrim.replace(/\s+$/,"");
}

export function trimBefore(s: string): string
{
   let newLineFound = false;
   for(let t=0; t<s.length; t++)
   {
      let char = s.charAt(t);
      if(char === "\r" || char === "\n") {
         newLineFound = true;
      }
      if(!(char === " " || char === "\r" || char === "\n" || char === "\t"))
      {
         if(!newLineFound) return s;
         return s.substr(t);
      }
   }
   if(!newLineFound) return s;
   return "";
}

export function trimAfter(s: string): string
{
   let newLineFound = false;
   for(let t=s.length-1; t>=0; t--)
   {
      let char = s.charAt(t);
      if(char === "\r" || char === "\n") {
         newLineFound = true;
      }
      if(!(char === " " || char === "\r" || char === "\n" || char === "\t"))
      {
         if(!newLineFound) return s;
         return s.substr(0, t+1);
      }
   }
   if(!newLineFound) return s;
   return "";
}
