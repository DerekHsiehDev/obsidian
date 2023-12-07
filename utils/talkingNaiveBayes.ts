const calculateCosineSimilarity = (
  bag1: BagOfWords,
  bag2: BagOfWords
): number => {
  let dotProduct = 0;
  let magnitude1 = 0;
  let magnitude2 = 0;

  for (const word in bag1) {
    dotProduct += (bag1[word] || 0) * (bag2[word] || 0);
    magnitude1 += Math.pow(bag1[word], 2);
  }

  for (const word in bag2) {
    magnitude2 += Math.pow(bag2[word], 2);
  }

  magnitude1 = Math.sqrt(magnitude1);
  magnitude2 = Math.sqrt(magnitude2);

  if (magnitude1 === 0 || magnitude2 === 0) {
    return 0;
  }

  return dotProduct / (magnitude1 * magnitude2);
};

import { stopWords } from "./stopWords";

type BagOfWords = { [key: string]: number };

const extractCapitalizedWords = (text: string): string[] => {
  const words = text.split(" ");
  return words.filter((word) => word[0] === word[0].toUpperCase());
};

const cleanText = (text: string): string => {
  // convert everything to lower cased
  text = text.toLowerCase();

  // remove all punctuation
  text = text.replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g, "");

  // remove all stop words
  const regex = new RegExp(`\\b(${stopWords.join("|")})\\b`, "gi");
  text = text.replace(regex, "");

  return text;
};

const createBagOfWords = (
  text: string,
  capitalizedWords: string[],
  weight: number = 1,
  capitalizedWeight: number = 4
): BagOfWords => {
  const words = text.split(" ");
  const bag: BagOfWords = {};

  words.forEach((word) => {
    if (word) {
      const wordWeight = capitalizedWords.includes(word)
        ? capitalizedWeight
        : weight;
      bag[word] = (bag[word] || 0) + wordWeight;
    }
  });

  return bag;
};

const compareTexts = (
  text1: string,
  text2: string,
  weight: number = 1,
  capitalizedWeight: number = 2
): number => {
  const capitalizedWords1 = extractCapitalizedWords(text1);
  const capitalizedWords2 = extractCapitalizedWords(text2);

  const cleanedText1 = cleanText(text1);
  const cleanedText2 = cleanText(text2);

  const bag1 = createBagOfWords(
    cleanedText1,
    capitalizedWords1,
    weight,
    capitalizedWeight
  );
  const bag2 = createBagOfWords(
    cleanedText2,
    capitalizedWords2,
    weight,
    capitalizedWeight
  );

  return calculateCosineSimilarity(bag1, bag2);
};

export default compareTexts;
