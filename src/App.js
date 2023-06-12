import React, { useEffect, useState } from "react";
import { AiOutlinePlus } from "react-icons/ai";
import { FaRegTrashAlt, FaEdit } from "react-icons/fa";
import Todo from "./Todo";
import { db } from "./firebase";
import {
  query,
  collection,
  onSnapshot,
  updateDoc,
  doc,
  addDoc,
  deleteDoc,
} from "firebase/firestore";

const style = {
  container: `bg-gradient-to-r from-[#2F80ED] to-[#1CB5E0] min-h-screen flex flex-col items-center justify-center`,
  heading: `text-4xl font-bold text-white mb-6`,
  form: `flex items-center mb-6`,
  input: `border p-2 mr-2 text-xl rounded`,
  button: `border p-2 bg-#C4B0FF-500 text-white rounded`,
  todosContainer: `max-w-md w-full bg-white rounded-md shadow-xl p-4`,
  todoItem: `flex justify-between items-center bg-gray-100 p-4 my-2 rounded`,
  todoText: `text-lg`,
  todoButtons: `flex items-center`,
  deleteButton: `p-2 ml-2 bg-red-500 text-white rounded`,
  editButton: `p-2 ml-2 bg-blue-500 text-white rounded`,
  count: `text-center text-gray-500 mt-4`,
};

function App() {
  const [todos, setTodos] = useState([]);
  const [input, setInput] = useState("");
  const [editTodoId, setEditTodoId] = useState(null);

  // Create todo
  const createTodo = async (e) => {
    e.preventDefault();
    if (input === "") {
      alert("Please enter a valid todo");
      return;
    }
  
    if (editTodoId) {
      // Update existing todo
      await updateDoc(doc(db, "todos", editTodoId), {
        text: input,
      });
      setEditTodoId(null); // Clear the edit state
    } else {
      // Create new todo
      await addDoc(collection(db, "todos"), {
        text: input,
        completed: false,
      });
    }
  
    setInput(""); // Clear the input field
  };

  
  // Read todo from firebase
  useEffect(() => {
    const q = query(collection(db, "todos"));
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      let todosArr = [];
      querySnapshot.forEach((doc) => {
        const todo = {...doc.data(), id: doc.id};
        todosArr.push({ ...doc.data(), id: doc.id });
      });
      setTodos(todosArr);
    });
    return () => unsubscribe();
  }, []);
  // update todo in firebase
  const toggleComplete = async (todo) => {
    await updateDoc(doc(db, "todos", todo.id), {
      completed: !todo.completed,
    });
  };
  // Edit todo
  const editTodo = (todo) => {
    setInput(todo.text);
    setEditTodoId(todo.id);
  };
  // Delete todo
  const deleteTodo = async (id) => {
    await deleteDoc(doc(db, "todos", id));
  };
  return (
    <div className={style.bg}>
      <div className={style.container}>
        <h3 className={style.heading}>Todo App </h3>
        <form onSubmit={createTodo} className={style.form}>
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className={style.input}
            type="text"
            placeholder="Add Todo"
          ></input>
          <button className={style.button}>
            <AiOutlinePlus size={30} />
          </button>
        </form>
        <ul>
          {todos.map((todo, index) => (
            <Todo
              key={index}
              todo={todo}
              toggleComplete={toggleComplete}
              deleteTodo={deleteTodo}
              editTodo={editTodo}
            />
          ))}
        </ul>
        {todos.length < 1 ? null : (
          <p className={style.count}>{`You have ${todos.length} todos`}</p>
        )}
      </div>
    </div>
  );
}

export default App;
