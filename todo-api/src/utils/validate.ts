export function isEmail(str: string): boolean {
  const strRegex =
    /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,5})+/;
  return strRegex.test(str);
}
