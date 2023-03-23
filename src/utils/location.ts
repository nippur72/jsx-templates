export interface Location
{
   line: number;
   col: number;
}

/*
function getNodeLoc(context, node) {
    var pos = getLine(context.html, node);
    var end;
    if (node.data) {
        end = node.startIndex + node.data.length;
    } else if (node.next) { // eslint-disable-line
        end = node.next.startIndex;
    } else {
        end = context.html.length;
    }
    return {
        pos: pos,
        start: node.startIndex,
        end: end
    };
}
*/

export function getLocation(html: string, startIndex: number): Location
{
   if(startIndex === 0) 
   {
      return {line: 1, col: 1};
   }
   let linesUntil = html.substring(0, startIndex).split('\n');
   return { line: linesUntil.length, col: linesUntil[linesUntil.length - 1].length + 1};
}


