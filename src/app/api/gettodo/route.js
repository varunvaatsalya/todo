import { connectionSrt } from "@/lib/db";
import { NextResponse } from "next/server";
import mongoose from "mongoose";
import Todo from "@/lib/model";

export async function GET() {
  try {
    await mongoose.connect(connectionSrt);
    try {
      const todos = await Todo.find({});
      const response = NextResponse.json(todos, { status: 200 });
      response.headers.set(
        "Cache-Control",
        "no-store, no-cache, must-revalidate, proxy-revalidate"
      );
      response.headers.set("Pragma", "no-cache");
      response.headers.set("Expires", "0");
      response.headers.set("Surrogate-Control", "no-store");
      return response;
    } catch (error) {
      console.error("Error fetching todos:", error);
      return NextResponse.json(
        { message: "Failed to fetch todos" },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error("Connection Error: ", error);
    return NextResponse.json({ error: "Connection failed" });
  }
}
