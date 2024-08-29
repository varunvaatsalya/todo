import mongoose from "mongoose"

const todoModel = new mongoose.Schema({
    title: {
        type: String,
      },
      description: {
        type: Object,
      },
      date: {
        type: String,
        required: true
      }
})

const Todo = mongoose.models.todos || mongoose.model("todos", todoModel);

module.exports = Todo;
