import React, { useState, useEffect } from "react";
import { IoClose, IoCreate } from "react-icons/io5"; // Импортируем иконки
import "./Todo.css"; // Импортируем стили

const Todo = () => {
  useEffect(() => {
    const savedTasks = localStorage.getItem("tasks");
    if (savedTasks) {
      setTask(JSON.parse(savedTasks));
    }
  }, []);

  const [todo, setTodo] = useState(""); // Для ввода новой задачи
  const [task, setTask] = useState([]); // Список всех задач

  // Функция для добавления задачи
  function addTask() {
    if (todo.trim() === "") return; // Не добавляем пустую задачу
    const newTask = {
      id: Date.now(), // Уникальный ID для каждой задачи
      task: todo,
      completed: false,
    };

    const updatedTasks = [...task, newTask];
    setTask(updatedTasks);
    setTodo(""); // Очищаем поле ввода

    localStorage.setItem("tasks", JSON.stringify(updatedTasks));
  }

  // Функция для переключения статуса выполненной/не выполненной задачи
  function toggleTask(id) {
    const updatedTasks = task.map((item) =>
      item.id === id ? { ...item, completed: !item.completed } : item
    );

    setTask(updatedTasks);
    localStorage.setItem("tasks", JSON.stringify(updatedTasks));
  }

  // Функция для удаления задачи
  function deleteTask(id) {
    const updatedTasks = task.filter((item) => item.id !== id);
    setTask(updatedTasks);
    localStorage.setItem("tasks", JSON.stringify(updatedTasks));
  }

  // Функция для редактирования задачи
  function editTask(id, newTaskText) {
    const updatedTasks = task.map((item) =>
      item.id === id ? { ...item, task: newTaskText } : item
    );
    setTask(updatedTasks);
    localStorage.setItem("tasks", JSON.stringify(updatedTasks));
  }

  return (
    <>
      <h1>Трекер задач</h1>
      <div className="input-container">
        <input
          type="text"
          placeholder="Введите задачу"
          value={todo}
          onChange={(e) => setTodo(e.target.value)}
        />
        <button onClick={addTask}>Добавить</button>
      </div>
      <ul>
        {task.map((item) => (
          <li key={item.id} className={item.completed ? "completed" : ""}>
            <input
              type="checkbox"
              checked={item.completed}
              onChange={() => toggleTask(item.id)}
            />
            <span className="task-text">{item.task}</span>
            <IoCreate
              onClick={() => {
                const newTaskText = prompt("Редактируйте задачу:", item.task);
                if (newTaskText && newTaskText.trim() !== "") {
                  editTask(item.id, newTaskText);
                }
              }}
              className="icon icon-edit"
            />
            <IoClose
              onClick={() => deleteTask(item.id)}
              className="icon icon-delete"
            />
          </li>
        ))}
      </ul>
    </>
  );
};

export default Todo;
