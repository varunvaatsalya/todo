import { connectionSrt } from "@/lib/db";
import { NextResponse } from "next/server";
import mongoose from "mongoose";
import Todo from "@/lib/model";

export async function GET(request) {
  // try {
  //     await mongoose.connect(connectionSrt);
  //     try {
  //         const todos = await Todo.find({});
  //         return NextResponse.json(todos, { status: 200 });
  //     } catch (error) {
  //         console.error("Error fetching todos:", error);
  //         return NextResponse.json({ message: "Failed to fetch todos" }, { status: 500 });
  //     }
  // } catch (error) {
  //     console.error("Connection Error: ", error);
  //     return NextResponse.json({error: "Connection failed"});
  // }

  try {
    // const url = new URL(request.url);
    // const todoId = url.searchParams.get("id");
    const todoId = request.nextUrl.searchParams.get("id");
console.log(todoId)
    if (!todoId) {
      return NextResponse.json(
        { message: "Todo ID is required" },
        { status: 400 }
      );
    }
    await mongoose.connect(connectionSrt);

    try {
      const result = await Todo.findByIdAndDelete(todoId);

      if (!result) {
        return NextResponse.json(
          { message: "Todo not found" },
          { status: 404 }
        );
      }

      return NextResponse.json(
        { message: todoId,success:true },
        { status: 200 }
      );
    } catch (error) {
      console.error("Error deleting todo:", error);
      return NextResponse.json(
        { message: "Failed to delete todo" },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error("Connection Error: ", error);
    return NextResponse.json({ error: "Connection failed" }, { status: 500 });
  }
}

// const searchParams = useSearchParams()
//   const search = searchParams.get('search')
