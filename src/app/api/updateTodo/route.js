import { connectionSrt } from "@/lib/db";
import { NextResponse } from "next/server";
import mongoose from "mongoose";
import Todo from "@/lib/model";

export async function POST(reqest){
    try {
        await mongoose.connect(connectionSrt);
            const { id, title, description } = await reqest.json();
            if (!id) {
                return NextResponse.json({ message: "ID is required" }, { status: 400 });
            }
            const currentDate = new Date();
            const options = { year: 'numeric', month: 'short', day: 'numeric' };
            const currentFormattedDate = currentDate.toLocaleDateString('en-US', options);
            try {
                const updatedTodo = await Todo.findByIdAndUpdate(
                    id,
                    {
                        title,
                        description,
                        date: currentFormattedDate
                    },
                    { new: true }
                );
    
                if (!updatedTodo) {
                    return NextResponse.json({ message: "Todo not found" }, { status: 404 });
                }
    
                return NextResponse.json({ message: "Todo updated successfully", todo: updatedTodo }, { status: 200 });
            } catch (error) {
                console.error("Error updating todo:", error);
                return NextResponse.json({ message: "Failed to update todo" }, { status: 500 });
            }
    } catch (error) {
        console.error("Connection Error: ", error);
        return NextResponse.json({error: "Connection failed"});
    }

    
}