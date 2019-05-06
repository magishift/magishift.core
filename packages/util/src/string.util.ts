export function capitalizeFirstLetter(word: string): string {
  return word.charAt(0).toUpperCase() + word.slice(1);
}

export function unCapitalizeFirstLetter(word: string): string {
  return word.charAt(0).toLocaleLowerCase() + word.slice(1);
}
