import { connectionSrt } from "@/lib/db";
import { NextResponse } from "next/server";
import mongoose from "mongoose";
import Todo from "@/lib/model";

export async function GET(){
    try {
        await mongoose.connect(connectionSrt);
        try {
            const todos = await Todo.find({});
            return NextResponse.json(todos, { status: 200 });
        } catch (error) {
            console.error("Error fetching todos:", error);
            return NextResponse.json({ message: "Failed to fetch todos" }, { status: 500 });
        }
    } catch (error) {
        console.error("Connection Error: ", error);
        return NextResponse.json({error: "Connection failed"});
    }

    
}