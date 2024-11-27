import { NextResponse } from "next/server";
import { reqGroqAI } from "../../../lib/groq";
export async function POST(req) {
  const data = await req.json();

  try {
    const chatCompletion = await reqGroqAI(data.content);
    return NextResponse.json(
      {
        content: chatCompletion.choices[0]?.message?.content || "",
      },
      { status: 200 }
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
