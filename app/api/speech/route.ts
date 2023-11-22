import { NextRequest, NextResponse } from "next/server";
import openai from "@/lib/OpenaiConfig";

export async function POST(request: NextRequest) {
    const { text } = await request.json();

    // ensure text is a string and not empty

    if (typeof text !== "string" || text.trim() === "") {
        return new Response("Text to speech must be a non-empty string", { status: 400 });
    }

    // generate audio 

    try {
        const audio = await openai.audio.speech.create({
            model: "tts-1",
            input: text,
            voice: "alloy",
            response_format: "mp3"
        });


        const audioStream = audio.body

        const headers = {
            'Content-Type': 'audio/mpeg'


        }


        return new NextResponse(audioStream, { status: 200, headers });



    } catch (error) {
        const err = error as { response?: { status: any, data: any }, message?: string };

        if (err.response) {
            console.error(err.response.status, err.response.data);
            return NextResponse.json({ error: err.response.data }, { status: 500 });
        } else {
            console.error(`Error with converting input to speech: ${err.message}`);
            return NextResponse.json(
                { error: "An error occurred during your request." },
                { status: 500 }
            );
        }
    }


}