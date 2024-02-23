export const capitalizeFirstLetter = (word: string) => word.charAt(0).toUpperCase() + word.slice(1);

export const capitalizeEachWord = (sentence: string) => {
  let arr2: string[] = [];
  const arr = sentence?.split(" ");

  if (arr?.length === 1) {
    return capitalizeFirstLetter(sentence);
  }
  if (arr?.length > 1) {
    arr2 = arr.map((word) => capitalizeFirstLetter(word));
  }
  return arr2.join(" ");
};

export const getFirstLetterCaps = (word: string) => word.charAt(0).toUpperCase();

export function toSentenceCase(str: string) {
  return str.toLowerCase().charAt(0).toUpperCase() + str.toLowerCase().slice(1);
}
