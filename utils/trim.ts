export function ltrim(stringToTrim: string): string
{
	return stringToTrim.replace(/^\s+/,"");
}

export function rtrim(stringToTrim: string): string 
{
	return stringToTrim.replace(/\s+$/,"");
}