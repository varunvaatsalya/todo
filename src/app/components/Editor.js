"use client";
import { Delete } from "./svgs";
import {
  FaArrowLeft,
  FaBold,
  FaCheck,
  FaItalic,
  FaListOl,
  FaListUl,
  FaUnderline,
} from "react-icons/fa";
import {
  MdFormatAlignCenter,
  MdFormatAlignLeft,
  MdFormatAlignRight,
  MdFormatColorFill,
  MdOutlineFormatAlignJustify,
} from "react-icons/md";
import { ImFontSize } from "react-icons/im";
import { useEffect, useState } from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Heading from "@tiptap/extension-heading";
import Underline from "@tiptap/extension-underline";
import BulletList from "@tiptap/extension-bullet-list";
import OrderedList from "@tiptap/extension-ordered-list";
import TextAlign from "@tiptap/extension-text-align";
import { Color } from "@tiptap/extension-color";
import TextStyle from "@tiptap/extension-text-style";

function Editor({ todo, deleteTodo, updateCurrentTodo, unSetCurrentTodo}) {
  const [titleValue, setTitleValue] = useState("");
  const [descriptionValue, setDescriptionValue] = useState("");

  useEffect(() => {
    if (todo) {
      setTitleValue(todo.title);
      setDescriptionValue(todo.description);
      console.log(todo.description, titleValue, descriptionValue, 1);
    }
  }, [todo]);

  // useEffect(()=>{
  //   updateCurrentTodo(titleValue, descriptionValue);
  // },[titleValue, descriptionValue])

  async function updateTodo() {
    if (todo._id) {
      console.log(todo._id, titleValue, descriptionValue);
      try {
        // process.env.NEXT_PUBLIC_API_BASE_URLL
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/updateTodo`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          cache: 'no-store' ,
          body: JSON.stringify({
            id: todo._id,
            title: titleValue,
            description: descriptionValue,
          }),
        });
        const result = await response.json();
        console.log(result);
      } catch (error) {
        console.error("Error creating todo:", error);
      }
    }
  }

  const editor = useEditor({
    extensions: [
      StarterKit.configure(),
      TextAlign.configure({
        types: ["heading", "paragraph"],
      }),
      Heading.configure({
        levels: [1, 2, 3],
      }),
      OrderedList.configure({
        HTMLAttributes: {
          class: "list-decimal ml-3",
        },
      }),
      BulletList.configure({
        HTMLAttributes: {
          class: "list-disc ml-3",
        },
      }),
      // {value:props.todo?props.todo.description:'<p>hiii</p>'},
      Underline,
      Color,
      TextStyle,
    ],
    content: descriptionValue,
    onUpdate: ({ editor }) => {
      console.log(editor.getHTML());
      setDescriptionValue(editor.getHTML());
      updateCurrentTodo(titleValue, descriptionValue);
    },
    editorProps: {
      attributes: {
        class:
          "w-full h-80 overflow-y-auto bg-white dark:bg-zinc-800 outline-none",
      },
    },
  });
  useEffect(() => {
    if (editor) {
      editor.commands.setContent(todo.description);
    }
  }, [todo, editor]);
  const toolBars = [
    {
      clicked: () => {
        editor.chain().focus().toggleBold().run();
      },
      icon: <FaBold />,
      pressed:'bold'
    },
    {
      clicked: () => {
        editor.chain().focus().toggleItalic().run();
      },
      icon: <FaItalic />,
      pressed:'italic'
    },
    {
      clicked: () => {
        editor.chain().focus().toggleUnderline().run();
      },
      icon: <FaUnderline />,
      pressed:'underline'
    },
    {
      clicked: () => {
        editor.chain().focus().setTextAlign("left").run();
      },
      icon: <MdFormatAlignLeft />,
      pressed:{ textAlign: 'left' }
    },
    {
      clicked: () => {
        editor.chain().focus().setTextAlign("center").run();
      },
      icon: <MdFormatAlignCenter />,
      pressed:{textAlign:"center"}
    },
    {
      clicked: () => {
        editor.chain().focus().setTextAlign("right").run();
      },
      icon: <MdFormatAlignRight />,
      pressed:{textAlign:"right"}
    },
    {
      clicked: () => {
        editor.chain().focus().setTextAlign("justify").run();
      },
      icon: <MdOutlineFormatAlignJustify />,
      pressed:{textAlign:"justify"}
    },
    {
      clicked: () => {
        editor.chain().focus().toggleBulletList().run();
      },
      icon: <FaListUl />,
      pressed:'bulletList'
    },
    {
      clicked: () => {
        editor.chain().focus().toggleOrderedList().run();
      },
      icon: <FaListOl />,
      pressed:'orderedList'
    },
    {
      clicked: () => {
        editor.chain().focus().setColor("#958DF1").run();
      },
      icon: <MdFormatColorFill />,
      pressed:('textStyle', { color: '#958DF1' })
    },
    {
      clicked: () => {
        editor.chain().focus().toggleHeading({level:1}).run();
      },
      icon: <ImFontSize />,
      pressed:('heading',{level:1})
    },
  ];

  return (
    <div className="w-full ">
      <div className="flex justify-center ">
        <div className="md:hidden cursor-pointer active:bg-black active:text-white dark:active:bg-white dark:active:text-zinc-800 h-10 w-12 py-2 px-3 flex justify-center items-center rounded-md mr-2 text-xl" onClick={unSetCurrentTodo}><FaArrowLeft/></div>
        <textarea
          className="font-medium text-3xl w-full outline-none bg-transparent h-12 "
          placeholder="Title"
          style={{ resize: "none" }}
          value={titleValue}
          onChange={(e) => {
            setTitleValue(e.target.value);
            updateCurrentTodo(titleValue, descriptionValue);
          }}
        />

        <div
          className={
            "hover:bg-red-500 text-black dark:text-white h-8 w-8 p-1 rounded-lg "
          }
          onClick={deleteTodo}
        >
          <Delete />
        </div>
      </div>
      <div className="mb-2 w-full flex flex-wrap items-center gap-2">
        {toolBars.map((toolbar, key) => {
          return (
            <div key={key} onClick={toolbar.clicked} className={decorateBg + (editor && editor.isActive(toolbar.pressed) ? activeBtn : "")}>
              {toolbar.icon}
            </div>
          );
        })}
      </div>
      <div className="w-full h-[380px]">
        <EditorContent editor={editor} />
        <div className="w-full flex justify-end">
          <div
            className={
              "w-24 p-1 rounded-lg flex justify-center gap-1 items-center cursor-pointer hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-zinc-800"
            }
            onClick={updateTodo}
          >
            <FaCheck size={16} />
            <span>Save</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Editor;

const decorateBg =
  " cursor-pointer hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-zinc-800 h-8 w-8 p-2 rounded-md ";
const activeBtn = " bg-black text-white dark:bg-white dark:text-zinc-800 ";
