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
    let { code } = await request.json();

    let correctCode = `interface Geo {
      lat: string;
      lng: string;
  }
  
  interface Address {
      street: string;
      suite: string;
      city: string;
      zipcode: string;
      geo: Geo;
  }
  
  interface Company {
      name: string;
      catchPhrase: string;
      bs: string;
  }
  
  interface User {
      name: string;
      username: string;
      email: string;
      address: Address;
      phone: string;
      website: string;
      company: Company;
  }
  
  class UserApi {
      private endpoint: string;
      private users: User[];
  
      constructor(endpoint: string) {
          this.endpoint = endpoint;
          this.users = [];
      }
  
      async fetchUsers(): Promise<void> {
          try {
              const response = await fetch(this.endpoint);
              if (!response.ok) {
                console.error('Error fetching users:', error.message);
              }
              const data: User = await response.json();
              this.users.push(data);
          } catch (error) {
              console.error('Error fetching users:', error);
          }
      }
  
      async performRequests() {
          for (let i = 0; i < 3; i++) {
              await this.fetchUsers();
          }
          console.log(this.users);
      }
  } const userApi = new UserApi('https://interview-api-pi.vercel.app/api/users');
  userApi.performRequests();`;

    // check if interview.vertix.dev/api/users || https://interview-api-pi.vercel.app/api/users exists and replace append to it ?query={randomIndex}

    const randomIndex = Math.floor(Math.random() * 10);

    // Define the URLs to be checked
    const urls = [
      "interview.vertix.dev/api/users",
      "https://interview-api-pi.vercel.app/api/users",
    ];

    for (let url of urls) {
      // regex to find the URL in the code
      const regex = new RegExp(url, "g");

      // Check if the URL exists in the code
      if (regex.test(code)) {
        code = code.replace(regex, `${url}?index=${randomIndex}`);
        correctCode = correctCode.replace(regex, `${url}?index=${randomIndex}`);
      }
    }

    console.log(code);

    // replace console.log with console.log(JSON.stringify(...))
    const codeWithJSONStringify = code.replace(
      /console\.log\((.*)\)/g,
      "console.log(JSON.stringify($1))"
    );
    const correctCodeWithJSONStringify = correctCode.replace(
      /console\.log\((.*)\)/g,
      "console.log(JSON.stringify($1))"
    );

    const sandbox = {
      userOutput: "", // capture user output
      correctOutput: "", // capture correct output
      console: {
        log: (...args: string[]) => {
          sandbox.userOutput += args.join(" ") + "\n";
        },
        correctLog: (...args: string[]) => {
          sandbox.correctOutput += args.join(" ") + "\n";
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
      sandbox.console.log = (...args: string[]) => {
        sandbox.userOutput += args.join(" ") + "\n";
      };
      await new Script(transpiledCode).runInContext(context, { timeout: 5000 });

      // Reset the output in the sandbox for the correct code
      sandbox.console.log = (...args: string[]) => {
        sandbox.correctOutput += args.join(" ") + "\n";
      };

      // Transpile and run the correct code
      const transpiledCorrectCode = transpileTypeScript(
        correctCodeWithJSONStringify
      );
      await new Script(transpiledCorrectCode).runInContext(context, {
        timeout: 5000,
      });

      // Return the output of both codes
      return new NextResponse(
        JSON.stringify({
          userResult: sandbox.userOutput,
          correctResult: sandbox.correctOutput,
          executionTime: Date.now() - startTime,
        }),
        { status: 200 }
      );
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
  } catch (error) {
    const err = error as Error;

    return new NextResponse(
      JSON.stringify({ error: "Unexpected error", details: err.message }),
      { status: 500 }
    );
  }
}
