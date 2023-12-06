// naive bayes

type BagOfWords = { [key: string]: number };

function createBagOfWords(text: string): BagOfWords {
  const words = text.split(/\s+/);
  const bag: BagOfWords = {};
  words.forEach((word) => {
    if (!bag[word]) {
      bag[word] = 0;
    }
    bag[word]++;
  });
  return bag;
}

let classCount = 0;
let functionCount = 0;
let varCount = 0;

function replaceNames(code: string): string {
  // This regular expression matches class names, function declarations, arrow functions, and variable names
  const classNameRegex = /class\s+(\w+)/g;
  const functionNameRegex = /function\s+(\w+)\s*\(/g;
  const arrowFunctionNameRegex = /(\w+)\s*=\s*\(\s*\)\s*=>/g;
  const variableNameRegex = /(let|const)\s+(\w+)\s*=/g;
  const asyncFunctionNameRegex = /async\s+(\w+)\s*\(\)/g;

  let replacedCode = code
    .replace(classNameRegex, () => `class className${classCount++}`)
    .replace(
      functionNameRegex,
      () => `function functionName${functionCount++}(`
    )
    .replace(arrowFunctionNameRegex, () => `varName${varCount++} = () =>`)
    .replace(variableNameRegex, (_, p1) => `${p1} varName${varCount++} =`)
    .replace(
      asyncFunctionNameRegex,
      () => `async functionName${functionCount++}()`
    );

  const noComments = replacedCode.replace(/\/\/.*/g, "");

  const lines = noComments.split("\n");

  for (let i = 0; i < lines.length; i++) {
    if (
      (lines[i].trim().startsWith("async ") ||
        !lines[i].trim().startsWith("class ")) &&
      lines[i].includes("()")
    ) {
      const words = lines[i].split(" ");

      for (let j = 0; j < words.length; j++) {
        if (words[j] === "async" || words[j].endsWith("(")) {
          words[j + 1] = "methodName";
          break;
        }
      }

      lines[i] = words.join(" ");
    }
  }

  return lines.join("\n");
}

function sigmoid(x: number): number {
  return 1 / (1 + Math.exp(-x));
}

export default function naiveBayes(
  modelSolution: string,
  studentSolution: string
): number {
  //   sigmoid(x) = 1 / ((1 + e) ^ -x);



  const modelSolutionBag = createBagOfWords(replaceNames(modelSolution));
  const studentSolutionBag = createBagOfWords(replaceNames(studentSolution));

//   console.log(replaceNames(modelSolution));
//   console.log(replaceNames(studentSolution));

//   console.log(replaceNames(modelSolution));
//   console.log(replaceNames(studentSolution));

  const modelSolutionWordCount = Object.keys(modelSolutionBag).length;
  const studentSolutionWordCount = Object.keys(studentSolutionBag).length;

  const modelSolutionProbability = Math.log(
    modelSolutionWordCount / (modelSolutionWordCount + studentSolutionWordCount)
  );
  const studentSolutionProbability = Math.log(
    studentSolutionWordCount /
      (modelSolutionWordCount + studentSolutionWordCount)
  );

  let modelSolutionLogLikelihood = 0;
  let studentSolutionLogLikelihood = 0;

  for (const word in modelSolutionBag) {
    const modelSolutionWordFrequency =
      modelSolutionBag[word] / modelSolutionWordCount;
    const studentSolutionWordFrequency = studentSolutionBag[word]
      ? studentSolutionBag[word] / studentSolutionWordCount
      : 0;
    modelSolutionLogLikelihood += Math.log(modelSolutionWordFrequency || 1);
    studentSolutionLogLikelihood += Math.log(studentSolutionWordFrequency || 1);
  }

  const logLikelihoodDifference =
    modelSolutionProbability +
    modelSolutionLogLikelihood -
    (studentSolutionProbability + studentSolutionLogLikelihood);

  return sigmoid(Math.exp(logLikelihoodDifference));
}
