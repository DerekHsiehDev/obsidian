import { NextRequest, NextResponse } from "next/server";
import vm from "vm";
import fetch from "node-fetch";

import * as ts from "typescript";

function transpileTypeScript(code: string): string {
  const result = ts.transpileModule(code, {
    compilerOptions: { module: ts.ModuleKind.CommonJS },
  });
  return result.outputText;
}

export async function POST(request: NextRequest) {
  try {
    const { code } = await request.json();

    // replace console.log with console.log(JSON.stringify(...))

    const codeWithJSONStringify = code.replace(
      /console\.log\((.*)\)/g,
      "console.log(JSON.stringify($1))"
    );

    const sandbox = {
      output: "", // capture user output
      console: {
        log: (...args: string[]) => {
          sandbox.output += args.join(" ") + "\n";
        },
      },
      fetch,
    };

    const context = (vm.createContext as (sandbox: vm.Context) => vm.Context)(
      sandbox
    );

    const Script = vm.Script as any as { new (code: string): vm.Script };

    const startTime = Date.now(); // start timer to time code execution speeds

    try {
      const transpiledCode = transpileTypeScript(codeWithJSONStringify);
      await new Script(transpiledCode).runInContext(context, { timeout: 5000 });
    } catch (executionError) {
      const err = executionError as Error;

      return new NextResponse(
        JSON.stringify({
          error: "Compilation Error",
          details: err.message,
        }),
        { status: 400 }
      );
    }

    const endTime = Date.now();

    const executionTime = endTime - startTime; // Calculate execution time

    // Return the captured output
    return new NextResponse(
      JSON.stringify({ result: sandbox.output, executionTime }),
      { status: 200 }
    );
  } catch (error) {
    const err = error as Error;

    return new NextResponse(
      JSON.stringify({ error: "Unexpected error", details: err.message }),
      { status: 500 }
    );
  }
}
