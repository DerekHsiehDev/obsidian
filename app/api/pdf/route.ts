import { NextRequest, NextResponse } from "next/server";
import pdfParse from "pdf-parse";

export async function POST(request: NextRequest) {
  try {
    const { file } = await request.json();

    // Convert the Base64 string back to a Buffer
    const dataBuffer = Buffer.from(file.split(",")[1], "base64");

    const data = await pdfParse(dataBuffer);

    console.log(data.text);

    return new NextResponse(data.text, { status: 200 });
  } catch (error) {
    console.error(error);
    return new NextResponse(`An error occurred: ${error}`, { status: 500 });
  }
}