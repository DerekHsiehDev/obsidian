import {
  CompilationStatus,
  useCompilationStore,
} from "@/stores/compilationStore";
import { syntaxHighlight } from "@/utils/syntaxHighlight";

const CodeConsole = () => {
  const { runtime, compilationStatus, output, correctOutput} = useCompilationStore();

  const cleanOutput = (output: string) => {
    try {
      // Remove non-printable and other non-valid JSON chars
      output = output.replace(/[\u0000-\u0019]+/g, "");
      let parsedOutput = JSON.parse(output);
      // Check if the parsed output is a string that can be parsed again
      if (typeof parsedOutput === "string") {
        try {
          parsedOutput = JSON.parse(parsedOutput);
        } catch (e) {
          console.error("Failed to parse inner JSON:", e);
        }
      }
      return parsedOutput;
    } catch (e) {
      console.error("Failed to parse output:", e);
      return null;
    }
  };

  const compilationText = () => {
    switch (compilationStatus) {
      case CompilationStatus.NOT_STARTED:
        return "No output - write some code and click 'Compile Code'";
      case CompilationStatus.IN_PROGRESS:
        return "Loading";
      case CompilationStatus.SUCCESS:
        return "Success compiling";
      case CompilationStatus.ERROR:
        return `Error compiling: ${output}`;
    }
  };

  const titleColor = () => {
    switch (compilationStatus) {
      case CompilationStatus.NOT_STARTED:
        return "text-gray-500";
      case CompilationStatus.IN_PROGRESS:
        return "text-yellow-500";
      case CompilationStatus.SUCCESS:
        return "text-green-500";
      case CompilationStatus.ERROR:
        return "text-red-500";
    }
  };

  return (
    <div
      className="absolute bottom-3 left-4 shadow rounded-lg p-4 h-500 z-0 bg-white"
      style={{ width: "47%" }}
    >
      <div className="flex justify-between items-center mb-4">
        <span className={` ${titleColor()} font-bold`}>
          {compilationText()}
        </span>

        {compilationStatus !== CompilationStatus.NOT_STARTED && (
          <span className="text-gray-500 text-sm">{`Runtime:  ${runtime} ms`}</span>
        )}
      </div>
      <div className="mb-4">
        <div className="text-gray-800 font-bold mb-1">Your output</div>
        <div className="overflow-auto max-h-[900px]">
          <pre className="overflow-auto bg-gray-100 text-sm rounded p-2 font-mono">
            {output ? (
              <code
                dangerouslySetInnerHTML={{
                  __html:
                    output !== ""
                      ? syntaxHighlight(JSON.stringify(cleanOutput(output)))
                      : "",
                }}
              />
            ) : (
              output
            )}
          </pre>
        </div>
        <div className="text-gray-800 font-bold mb-1">Correct Output</div>
        <div className="overflow-auto max-h-[900px]">
          <pre className="overflow-auto bg-gray-100 text-sm rounded p-2 font-mono">
            {output ? (
              <code
                dangerouslySetInnerHTML={{
                  __html:
                    output !== ""
                      ? syntaxHighlight(JSON.stringify(cleanOutput(correctOutput)))
                      : "",
                }}
              />
            ) : (
              output
            )}
          </pre>
        </div>
      </div>
    </div>
  );
};

export default CodeConsole;
