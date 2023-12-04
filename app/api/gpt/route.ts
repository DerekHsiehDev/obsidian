import openai from "@/lib/OpenaiConfig";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  const { messages } = await request.json();

  let systemMessage = [
    {
        role: "system",
        content: "You are a helpful code assistant DURING a technical interview, feel free to give code snippets but NEVER teach them the steps to fully implement something. You will return code in backticks ``. You will be as concise as possible with your responses. Never use a specific URL or what the user wants (never let them have the exact answer and copy and paste). ALWAYS guide them with documentation but not exact solution. You can give code examples."
    },
  ]

  const gptMessages = [...systemMessage, ...messages]

  // ensure text is a string and not empty

  try {
    const gptResponse = await openai.chat.completions.create({
      model: "gpt-3.5-turbo-1106",
      messages: gptMessages,
      max_tokens: 200,
    });

    return NextResponse.json({text: gptResponse.choices[0].message.content}, { status: 200 });
  } catch (error) {
    console.error(error);
    return new NextResponse("Error generating response", { status: 500 });
  }
}
