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

export default function naiveBayes(modelSolution: string, studentSolution: string): number {
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

  return similarity * 2;
}


// export default function naiveBayes(
//   modelSolution: string,
//   studentSolution: string
// ): number {
//   const modelCode = replaceNames(modelSolution);
//   const studentCode = replaceNames(studentSolution);

//   // Extract different kinds of features with corresponding weights
//   const modelStructuralBag = extractStructuralFeatures(modelCode);
//   const studentStructuralBag = extractStructuralFeatures(studentCode);
//   const modelTypeInterfaceBag = extractTypeAndInterfaceFeatures(modelCode);
//   const studentTypeInterfaceBag = extractTypeAndInterfaceFeatures(studentCode);

//   // Combine the bags of words for each solution
//   const modelSolutionBag = { ...modelStructuralBag, ...modelTypeInterfaceBag };
//   const studentSolutionBag = {
//     ...studentStructuralBag,
//     ...studentTypeInterfaceBag,
//   };

//   // Union of unique words from both solutions
//   const vocabulary = new Set([
//     ...Object.keys(modelSolutionBag),
//     ...Object.keys(studentSolutionBag),
//   ]);

//   const smoothingFactor = 1; // Smoothing factor (Laplace smoothing)
//   let logLikelihood = 0; // Initializing the log likelihood

//   // Calculate the sum of log likelihood ratios for the words
//   vocabulary.forEach((word) => {
//     const modelWordFrequency = modelSolutionBag[word] || 0;
//     const studentWordFrequency = studentSolutionBag[word] || 0;

//     // Add Laplace smoothing
//     const smoothedModelWordFrequency = modelWordFrequency + smoothingFactor;
//     const smoothedStudentWordFrequency = studentWordFrequency + smoothingFactor;

//     const modelProbability =
//       smoothedModelWordFrequency /
//       (Object.values(modelSolutionBag).reduce((a, b) => a + b, 0) +
//         smoothingFactor * vocabulary.size);
//     const studentProbability =
//       smoothedStudentWordFrequency /
//       (Object.values(studentSolutionBag).reduce((a, b) => a + b, 0) +
//         smoothingFactor * vocabulary.size);

//     if (studentProbability !== 0 && modelProbability !== 0) {
//       logLikelihood += Math.log(studentProbability / modelProbability);
//     }
//   });

//   console.log("logLikelihood", logLikelihood)

//   // Convert the log likelihood into a similarity probability
//   const similarity = sigmoid(logLikelihood);

//   // Output the similarity for debugging
//   console.log("Similarity of student solution to model solution:", similarity);

//   return similarity; // Return the similarity score
// }
// // naive bayes

// type BagOfWords = { [key: string]: number };

// function createBagOfWords(text: string): BagOfWords {
//   const words = text.split(/\s+/);
//   const bag: BagOfWords = {};
//   words.forEach((word) => {
//     if (!bag[word]) {
//       bag[word] = 0;
//     }
//     bag[word]++;
//   });
//   return bag;
// }

// let classCount = 0;
// let functionCount = 0;
// let varCount = 0;

// const typeInterfaceWeight = 0.1;

// function createBagOfCode(code: string): BagOfWords {
//   const bag: BagOfWords = {};

//   // Define regex patterns for higher-level language constructs
//   const patterns = [
//     /class\s+\w+/g, // class declarations
//     /function\s+\w+\s*\(/g, // function declarations
//     /=>/g, // arrow functions
//     /for\s*\(/g, // for loops
//     /if\s*\(/g, // if statements
//     /else/g, // else
//     /async\s+function/g, // async functions
//     /const\s+\w+\s*=/g, // const variable declarations
//     /let\s+\w+\s*=/g, // let variable declarations
//     /type\s+\w+\s*=/g, // type aliases
//     /interface\s+\w+/g, // interface declarations
//     /await/g, // await keyword
//     /fetch/g, // fetch calls
//     /\.\.+\s*\w+/g, // spread operator (...)
//     /try\s*{/g, // try blocks
//     /catch\s*\(.*\)\s*{/g, // catch blocks
//     /throw\s+/g, // throw statements
//     /\w+\s*:\s*\w+/g, // type annotations (variable: type)
//     // add other patterns as needed
//   ];

//   // Concatenate all matches from patterns into a single string to count
//   let combinedMatches = "";
//   patterns.forEach((pattern) => {
//     const matches = code.match(pattern) || [];
//     combinedMatches += " " + matches.join(" ");
//   });
//   const interfacePattern = /interface\s+\w+\s*{[^}]*}/g;
//   const typePattern = /type\s+\w+\s*=\s*{[^}]*}/g;

//   // Remove interfaces and types from the code for general pattern matching
//   let codeWithoutTypesAndInterfaces = code
//     .replace(interfacePattern, "")
//     .replace(typePattern, "");

//   // Match and apply weights to interfaces and types separately
//   const interfaceMatches = code.match(interfacePattern) || [];
//   interfaceMatches.forEach((match) => {
//     bag[match] = (bag[match] || 0) + typeInterfaceWeight;
//   });

//   const typeMatches = code.match(typePattern) || [];
//   typeMatches.forEach((match) => {
//     bag[match] = (bag[match] || 0) + typeInterfaceWeight;
//   });

//   // Split combined matches into "words" and count them in the bag
//   const words = combinedMatches.split(/\s+/);
//   words.forEach((word) => {
//     if (word) {
//       // avoid counting empty strings
//       bag[word] = (bag[word] || 0) + 1;
//     }
//   });

//   return bag;
// }

// function replaceNames(code: string): string {
//   // This regular expression matches class names, function declarations, arrow functions, and variable names
//   const classNameRegex = /class\s+(\w+)/g;
//   const functionNameRegex = /function\s+(\w+)\s*\(/g;
//   const arrowFunctionNameRegex = /(\w+)\s*=\s*\(\s*\)\s*=>/g;
//   const variableNameRegex = /(let|const)\s+(\w+)\s*=/g;
//   const asyncFunctionNameRegex = /async\s+(\w+)\s*\(\)/g;

//   let replacedCode = code
//     .replace(classNameRegex, () => `class className${classCount++}`)
//     .replace(
//       functionNameRegex,
//       () => `function functionName${functionCount++}(`
//     )
//     .replace(arrowFunctionNameRegex, () => `varName${varCount++} = () =>`)
//     .replace(variableNameRegex, (_, p1) => `${p1} varName${varCount++} =`)
//     .replace(
//       asyncFunctionNameRegex,
//       () => `async functionName${functionCount++}()`
//     );

//   const noComments = replacedCode.replace(/\/\/.*/g, "");

//   const lines = noComments.split("\n");

//   for (let i = 0; i < lines.length; i++) {
//     if (
//       (lines[i].trim().startsWith("async ") ||
//         !lines[i].trim().startsWith("class ")) &&
//       lines[i].includes("()")
//     ) {
//       const words = lines[i].split(" ");

//       for (let j = 0; j < words.length; j++) {
//         if (words[j] === "async" || words[j].endsWith("(")) {
//           words[j + 1] = "methodName";
//           break;
//         }
//       }

//       lines[i] = words.join(" ");
//     }
//   }

//   return lines.join("\n");
// }

// function sigmoid(x: number): number {
//   if (x < 0) {
//     const z = Math.exp(x);
//     return z / (1 + z);
//   } else {
//     return 1 / (1 + Math.exp(-x));
//   }
// }

// export default function naiveBayes(
//   modelSolution: string,
//   studentSolution: string
// ) {
//   const modelSolutionBag = createBagOfCode(replaceNames(modelSolution));
//   const studentSolutionBag = createBagOfCode(replaceNames(studentSolution));

//   // Use a combined set of unique words from both the model and the student's solutions
//   const vocabulary = new Set([
//     ...Object.keys(modelSolutionBag),
//     ...Object.keys(studentSolutionBag),
//   ]);

//   const smoothingFactor = 1; // Smoothing factor (Laplace smoothing)

//   let likelihood = 0; // Initializing the likelihood

//   // Iterate over the full vocabulary
//   vocabulary.forEach((word) => {
//     const modelWordFrequency = modelSolutionBag[word] || 0;
//     const studentWordFrequency = studentSolutionBag[word] || 0;

//     // Add Laplace smoothing
//     const smoothedModelWordFrequency = modelWordFrequency + smoothingFactor;
//     const smoothedStudentWordFrequency = studentWordFrequency + smoothingFactor;

//     // Calculate the probability of the word in both the model and student solutions
//     const modelProbability =
//       smoothedModelWordFrequency /
//       (Object.values(modelSolutionBag).reduce((a, b) => a + b, 0) +
//         smoothingFactor * vocabulary.size);
//     const studentProbability =
//       smoothedStudentWordFrequency /
//       (Object.values(studentSolutionBag).reduce((a, b) => a + b, 0) +
//         smoothingFactor * vocabulary.size);

//     // Accumulate the log likelihood ratio for the word
//     if (studentProbability !== 0 && modelProbability !== 0) {
//       // Avoid division by zero
//       likelihood += Math.log(studentProbability / modelProbability);
//     }
//   });

//   // Since Naive Bayes outputs the log likelihoods, to transform the log likelihood into a probability
//   // we use the logistic function which bounds the result between 0 and 1.
//   const similarity = 1 / (1 + Math.exp(-likelihood));

//   // Output the similarity for debugging
//   console.log("Similarity of student solution to model solution:", similarity);

//   // Return the similarity score
//   return similarity;
// }
