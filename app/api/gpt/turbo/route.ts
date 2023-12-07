import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(request: NextRequest) {
  const { resume } = await request.json();

  const response = await openai.chat.completions.create({
    model: "gpt-4-1106-preview",
    messages: [
      {
        role: "system",
        content:
          'you are a technical interviewer, reading a junior engineer\'s resume and asking questions to ensure their knowledge base matches with what they said in their resume. Try to be as objective as possible, leave very little room for interpretation. \n\ngenerate both a question, and an answer (ensure that the answer is objective and can be used as a source of truth when checking with the interviewee\'s response which i will check with Naive Bayes). Imagine you are directly asking the question to the applicant, and the applicant is answering in the answer. Never ask questions that can have multiple answers, such as what were your technical challenges, too vague, or try to catch all types of answers, ask questions like how did you build out the AI pipeline with x tool.\n\nin this JSON format \n[{\n"QUESTION": string\n"ANSWER": string \n}]. Unless the resume explains exactly what they did, refrain from asking about direct experiences, and focus more on understanding of the technologies used with lots of keywords capitalized.',
      },
      {
        role: "user",
        content: `RESUME START: ${resume} \n\nRESUME END\n\nThe year is 2023, don't pull anything from too old Generate an array of these 3 question and answers using the entire resume provided, one about experience/project (showing development expertise), and have them answer questions about one of the technologies/frameworks they listed in what they know a more niche and specific they used (such as Firebase Firestore) used to ensure the applicant actually understands it and isn't regurgitating information. Focus your questions on web development if they have the experience`,
      },
    ],
    temperature: 1,
    top_p: 1,
    frequency_penalty: 0,
    presence_penalty: 0,
  });

  return NextResponse.json(
    { text: response.choices[0].message.content },
    { status: 200 }
  );
}
