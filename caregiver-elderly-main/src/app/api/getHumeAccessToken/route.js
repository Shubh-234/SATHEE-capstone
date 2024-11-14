// app/api/getHumeAccessToken/route.js

import { fetchAccessToken } from "hume";
import { NextResponse } from "next/server";
export async function GET() {
  try {
    const accessToken = await fetchAccessToken({
      apiKey: process.env.HUME_API_KEY,
      secretKey: process.env.HUME_SECRET_KEY,
    });

    // Handle undefined access token case
    if (accessToken === "undefined") {
      return NextResponse.json(null, { status: 404 });
    }

    // Return the access token in JSON format
    return NextResponse.json({ accessToken }, { status: 200 });
  } catch (error) {
    console.error("Error fetching Hume access token:", error);
    return NextResponse.json("Error fetching access token", { status: 500 });
  }
}
