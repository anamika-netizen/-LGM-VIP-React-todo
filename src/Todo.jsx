import React from "react";
import { FaRegTrashAlt, FaEdit } from "react-icons/fa";

const style = {
  todoItem: `flex justify-between items-center bg-gray-100 p-4 my-2 rounded`,
  todoText: `text-lg`,
  todoButtons: `flex items-center`,
  deleteButton: `p-2 ml-2 bg-red-500 text-white rounded`,
  editButton: `p-2 ml-2 bg-blue-500 text-white rounded`,
};

const Todo = ({ todo, toggleComplete, deleteTodo, editTodo }) => {
  return (
    <li className={style.todoItem}>
      <span className={style.todoText}>{todo.text}</span>
      <div className={style.todoButtons}>
        <button
          onClick={() => deleteTodo(todo.id)}
          className={style.deleteButton}
        >
          <FaRegTrashAlt size={18} />
        </button>
        <button onClick={() => editTodo(todo)} className={style.editButton}>
          <FaEdit size={18} />
        </button>
      </div>
    </li>
  );
};

export default Todo;


