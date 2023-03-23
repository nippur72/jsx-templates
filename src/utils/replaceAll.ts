
export function replaceAll(text: string, search: string, replace: string) {
   return text.split(search).join(replace);
}