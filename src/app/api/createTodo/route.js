import { connectionSrt } from "@/lib/db";
import { NextResponse } from "next/server";
import mongoose from "mongoose";
import Todo from "@/lib/model";

export async function GET() {
  try {
    await mongoose.connect(connectionSrt);
    try {
      const currentDate = new Date();
      const options = { year: "numeric", month: "short", day: "numeric" };
      const formattedDate = currentDate.toLocaleDateString("en-US", options);
      const newTodo = new Todo({
        title: "",
        description: "",
        date: formattedDate,
      });
      await newTodo.save();
      const response = NextResponse.json(
        { message: "Todo saved successfully", todo: newTodo },
        { status: 201 }
      );
      console.log(newTodo);
      response.headers.set(
        "Cache-Control",
        "no-store, no-cache, must-revalidate, proxy-revalidate"
      );
      response.headers.set("Pragma", "no-cache");
      response.headers.set("Expires", "0");
      response.headers.set("Surrogate-Control", "no-store");
      return response;
    } catch (error) {
      console.error("Error saving todos:", error);
      return NextResponse.json(
        { message: "Failed to save todos" },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error("Connection Error: ", error);
    return NextResponse.json({ error: "Connection failed" });
  }
}
