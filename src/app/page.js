"use client";

import { Addnotes, Search } from "./components/svgs";
import Editor from "./components/Editor";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ImCross } from "react-icons/im";
import { IoIosCreate } from "react-icons/io";
import { FaPenToSquare } from "react-icons/fa6";
import Header from "./components/Header";
import { FaArrowLeft } from "react-icons/fa";

export default function Home() {
  const [ToDoData, setToDoData] = useState(null);
  const [todo, setTodo] = useState(null);
  const [isSearch, setIsSearch] = useState(false);
  const [search, setSearch] = useState("");
  const [filteredTodos, setFilteredTodos] = useState([]);
  // const router = useRouter();

  function todoUnShift() {
    if (todo) {
      const index = ToDoData.findIndex((todos) => todos._id === todo._id);
      if (index != -1) {
        const [todos] = ToDoData.splice(index, 1);
        ToDoData.unshift(todos);
      }
    }
  }

  function unSetCurrentTodo() {
    setTodo(null);
  }

  useEffect(() => {
    if (ToDoData) {
      const result = ToDoData.filter((todo) =>
        todo.title.toLowerCase().includes(search.toLowerCase())
      );
      setFilteredTodos(result);
    }
  }, [search, ToDoData, isSearch]);

  function updateCurrentTodo(title, description) {
    if (todo) {
      let dummyTodo = todo;
      dummyTodo.title = title;
      dummyTodo.description = description;
      console.log(todo);
      setTodo(dummyTodo);
      todoUnShift();
    }
  }

  function extractContent(htmlString) {
    const parser = new DOMParser();
    const doc = parser.parseFromString(htmlString, "text/html");
    return doc.body.textContent || "";
  }

  const fetchTodo = async () => {
    let todoResult = await fetch(`${window.location.origin}/api/gettodo`);
    todoResult = await todoResult.json();
    todoResult = todoResult.slice().reverse();
    setToDoData(todoResult);
  };

  useEffect(() => {
    fetchTodo();
  }, []);

  async function createTodo() {
    let getTodoData = await fetch(`${window.location.origin}/api/createTodo`);
    getTodoData = await getTodoData.json();
    if (getTodoData.todo) {
      setTodo(getTodoData.todo);
      setToDoData([getTodoData.todo, ...ToDoData]);
    }
  }

  async function deleteTodo() {
    setToDoData((prevTodos) =>
      prevTodos.filter((todos) => todos._id !== todo._id)
    );
    setTodo(null);
    let getTodoDeleteStatus = await fetch(
      `${window.location.origin}/api/deleteTodo?id=${todo._id}`
    );
    getTodoDeleteStatus = getTodoDeleteStatus.json();
    console.log(getTodoDeleteStatus.success);
  }
  useEffect(() => {}, [todo]);

  return (
    <div className="w-full h-full bg-zinc-100 dark:bg-black">
      <Header />

      <div className="w-full px-4 md:px-16 lg:px-28 mt-8 md:mt-12 lg:mt-15 md:flex">
        <div
          className={`${
            todo && "hidden"
          } md:block w-full md:w-[401px] lg:w-[500px] md:mr-12`}
        >
          <div className="h-12 w-full flex justify-between mb-2">
            {isSearch ? (
              <div className="w-full h-full pr-2">
                <input
                  type="text"
                  name="search"
                  value={search}
                  onChange={(e) => {
                    setSearch(e.target.value);
                  }}
                  placeholder="Search in Title"
                  className="h-full px-2 bg-white dark:bg-zinc-800 rounded-lg w-full bg-transparent outline-none font-semibold text-lg"
                />
              </div>
            ) : (
              <div
                onClick={createTodo}
                className="py-3 px-4 flex gap-2 bg-black hover:bg-zinc-900 active:bg-zinc-900 dark:bg-white dark:hover:bg-gray-200 dark:active:bg-gray-200  rounded-xl text-white dark:text-black cursor-pointer"
              >
                <Addnotes />
                <div className="font-medium text-sm">TODO</div>
              </div>
            )}
            <div
              onClick={() => {
                setIsSearch(!isSearch);
              }}
              className="bg-white hover:bg-gray-200 active:bg-gray-300 dark:bg-zinc-800 hover:dark:bg-zinc-700 active:dark:bg-zinc-600 py-3 px-4 flex justify-center items-center rounded-lg text-black dark:text-white"
            >
              {isSearch ? <ImCross /> : <Search />}
            </div>
          </div>
          <div
            key={todo}
            className="w-full h-full flex flex-col justify-cente items-center"
          >
            {filteredTodos && filteredTodos.length ? (
              filteredTodos.map((todo, key) => {
                return (
                  <div
                    key={key}
                    onClick={() => {
                      setTodo(todo);
                      console.log(todo);
                      todoUnShift();
                    }}
                    className="w-full px-4 py-2 bg-white hover:bg-zinc-200 dark:bg-zinc-800 hover:dark:bg-zinc-900 my-1 rounded-xl cursor-pointer"
                  >
                    <div className="line-clamp-1 font-semibold text-lg">
                      {todo.title ? (
                        todo.title
                      ) : (
                        <div className="opacity-50">Title</div>
                      )}
                    </div>
                    <div className="flex justify-between items-center font-light">
                      <div className="line-clamp-2 text-xs py-1 w-60">
                        {todo.description ? (
                          extractContent(todo.description)
                        ) : (
                          <div className="opacity-50">Description</div>
                        )}
                      </div>
                      <div className="text-[10px]">{todo.date}</div>
                    </div>
                  </div>
                );
              })
            ) : (
              <>
                <div className="font-bold text-xl flex items-center gap-2 py-8">
                  <FaPenToSquare /> Create TODO
                </div>
              </>
            )}
          </div>
        </div>
        <div
          key={todo}
          className={`${
            !todo && "hidden"
          } md:block w-full h-[500px] md:mr-18 py-4 px-5 md:px-10 bg-white dark:bg-zinc-800 rounded-xl`}
        >
          {todo != null ? (
            <>
              <Editor
                todo={todo}
                deleteTodo={deleteTodo}
                updateCurrentTodo={updateCurrentTodo}
                unSetCurrentTodo={unSetCurrentTodo}
              />
            </>
          ) : (
            <div className="h-full w-full flex flex-col justify-center items-center opacity-55">
              <IoIosCreate className="text-7xl" />
              <p>
                A goal without a plan is just a wish. Turn your todos into
                achievements.
              </p>
              <p className="text-3xl">Please Select Todo</p>
            </div>
          )}
          {/* <Editor content={value} onChange={(value)=>{setValue(value)}}/> */}
        </div>
      </div>
    </div>
  );
}
