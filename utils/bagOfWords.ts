type BagOfWords = { [key: string]: number };

// Functions to create bags of words with weight
function createBagOfWords(text: string, weight: number = 1): BagOfWords {
  const words = text.split(/\s+/);
  const bag: BagOfWords = {};
  words.forEach((word) => {
    if (word) {
      bag[word] = (bag[word] || 0) + weight;
    }
  });
  return bag;
}

// Function to extract structural features from the code
function extractStructuralFeatures(code: string): BagOfWords {
  const structuralPatterns = [
    /class\s+\w+/g,
    /function\s+\w+\s*\(/g,
    /=>/g,
    /for\s*\(/g,
    /if\s*\(/g,
    /else/g,
    /async\s+function/g,
    /const\s+\w+\s*=/g,
    /let\s+\w+\s*=/g,
    /\.\.\.\s*\w+/g,
    /try\s*{/g,
    /catch\s*\(.*\)\s*{/g,
    /throw\s+/g,
    // Add other patterns for structural code elements as needed
  ];

  let combinedMatches = "";
  structuralPatterns.forEach((pattern) => {
    const matches = code.match(pattern) || [];
    combinedMatches += " " + matches.join(" ");
  });

  return createBagOfWords(combinedMatches.trim(), codeConstructWeight);
}

// Function to extract type and interface definitions with lower weight
function extractTypeAndInterfaceFeatures(code: string): BagOfWords {
  const typeInterfacePattern = /(?:type|interface)\s+\w+\s*{[^}]*}/g;
  const matches = code.match(typeInterfacePattern) || [];
  const combinedMatches = matches.join(" ");
  return createBagOfWords(combinedMatches.trim(), typeInterfaceWeight);
}

// Replace function names, class names, and variable names with generic placeholders
function replaceNames(code: string): string {
  const classNameRegex = /class\s+(\w+)/g;
  const functionNameRegex = /function\s+(\w+)\s*\(/g;
  const variableNameRegex = /(let|const|var)\s+(\w+)\s*=/g;
  const methodNameRegex = /\b(\w+)\s*\(.*?\)\s*{/g;
  const asyncFunctionNameRegex = /async\s+(\w+)\s*\(\)/g;

  let replacedCode = code
    .replace(classNameRegex, "class className")
    .replace(functionNameRegex, "function functionName(")
    .replace(variableNameRegex, "$1 variableName =")
    .replace(methodNameRegex, "methodName() {")
    .replace(asyncFunctionNameRegex, "async asyncFunctionName()");

  return replacedCode.replace(/\/\/.*/g, ""); // Remove comments
}

// Sigmoid function for converting log odds to probabilities
function sigmoid(x: number): number {
  return 1 / (1 + Math.exp(-x));
}

const typeInterfaceWeight = 0.4; // Adjust these to fine-tune the impact
console.log("type interface weihgt", typeInterfaceWeight)
const codeConstructWeight = 1;

export default function naiveBayes(modelSolution: string, studentSolution: string, timeSpentOnChatAndTools: {
  chat: number, 
  tools: number;
}): number {
  const modelCode = replaceNames(modelSolution);
  const studentCode = replaceNames(studentSolution);

  // Extract different kinds of features with corresponding weights
  const modelStructuralBag = extractStructuralFeatures(modelCode);
  const studentStructuralBag = extractStructuralFeatures(studentCode);
  const modelTypeInterfaceBag = extractTypeAndInterfaceFeatures(modelCode);
  const studentTypeInterfaceBag = extractTypeAndInterfaceFeatures(studentCode);

  // Combine the bags of words for each solution
  const modelSolutionBag = { ...modelStructuralBag, ...modelTypeInterfaceBag };
  const studentSolutionBag = {
    ...studentStructuralBag,
    ...studentTypeInterfaceBag,
  };

  // Union of unique words from both solutions
  const vocabulary = new Set([
    ...Object.keys(modelSolutionBag),
    ...Object.keys(studentSolutionBag),
  ]);

  const smoothingFactor = 1; // Smoothing factor (Laplace smoothing)
  let score = 0; // Initializing the score

  // Calculate the score based on the differences in frequencies
  vocabulary.forEach((word) => {
    const modelWordFrequency = modelSolutionBag[word] || 0;
    const studentWordFrequency = studentSolutionBag[word] || 0;

    // Calculate the absolute difference in frequencies
    const frequencyDifference = Math.abs(modelWordFrequency - studentWordFrequency);

    // Subtract the difference from the score (more difference = lower score)
    score -= frequencyDifference;
  });

  console.log("Score before normalization", score);

  // Normalize the score
  // Assuming the worst-case score is some negative value (e.g., -vocabulary.size)
  // This makes the score 0 for identical solutions and negative otherwise
  score = score / vocabulary.size; 

  console.log("Normalized Score", score);

  // Convert the normalized score into a similarity probability using sigmoid
  const similarity = sigmoid(score);

  const timeRatio = (timeSpentOnChatAndTools.chat + 1) / (timeSpentOnChatAndTools.tools + 1); // Add 1 to avoid division by zero

  console.log(timeSpentOnChatAndTools)

  console.log(timeRatio)

  const adjustedSimilarity = similarity * timeRatio;


  console.log("NORMAL SIMILARITYl", similarity)
  console.log("TIME RATIO", timeRatio)


  // return similarity * 2;
  return adjustedSimilarity * 2
}