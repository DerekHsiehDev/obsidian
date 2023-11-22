import { NextRequest, NextResponse } from "next/server";
import { exec } from "child_process";
import fs from "fs";
import openai from "@/lib/OpenaiConfig";

const util = require("util");
const execAsync = util.promisify(exec);



export async function POST(request: NextRequest) {
  const { audio } = await request.json();

  const audioData = Buffer.from(audio, 'base64');

  try {
    // Convert the audio data to text
    const text = await convertAudioToText(audioData);
    // Return the transcribed text in the response
    return NextResponse.json({ result: text }, { status: 200 });
  } catch (error) {
    const err = error as { response?: { status: any, data: any }, message?: string };

    if (err.response) {
      console.error(err.response.status, err.response.data);
      return NextResponse.json({ error: err.response.data }, { status: 500 });
    } else {
      console.error(`Error with transcription request: ${err.message}`);
      return NextResponse.json(
        { error: "An error occurred during your request." },
        { status: 500 }
      );
    }
  }
}

async function convertAudioToMp3(audioData: Buffer) {
  // Write the audio data to a file
  const inputPath = "/tmp/input.webm";
  fs.writeFileSync(inputPath, audioData);
  // Convert the audio to MP3 using ffmpeg
  const outputPath = "/tmp/output.mp3";
  await execAsync(`ffmpeg -i ${inputPath} ${outputPath}`);
  // Read the converted audio data
  const mp3AudioData = fs.readFileSync(outputPath);
  // Delete the temporary files
  fs.unlinkSync(inputPath);
  fs.unlinkSync(outputPath);
  return mp3AudioData;
}

async function convertAudioToText(audioData: Buffer) {
  // Convert the audio data to MP3 format
  const mp3AudioData = await convertAudioToMp3(audioData);
  // Write the MP3 audio data to a file
  const outputPath = "/tmp/output.mp3";
  fs.writeFileSync(outputPath, mp3AudioData);
  // Transcribe the audio
  const response = await openai.audio.transcriptions.create({
    file: fs.createReadStream(outputPath),
    model: "whisper-1",
  });
  // Delete the temporary file
  fs.unlinkSync(outputPath);
  // The API response contains the transcribed text
  const transcribedText = response.text;
  return transcribedText;
}
