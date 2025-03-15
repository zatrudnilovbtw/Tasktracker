import React, { useState, useEffect } from "react";
import { DragDropContext } from "react-beautiful-dnd";
import { v4 as uuidv4 } from "uuid";
import TaskList from "./TaskList";
import "./Todo.css";

const Todo = () => {
  const [tasks, setTasks] = useState([]);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const savedTasks = localStorage.getItem("tasks");
    if (savedTasks) {
      setTasks(JSON.parse(savedTasks));
    }
    const timer = setTimeout(() => setIsLoaded(true), 100);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (isLoaded) localStorage.setItem("tasks", JSON.stringify(tasks));
  }, [tasks, isLoaded]);

  const addTask = (category, taskText, deadline = null, priority = "Low") => {
    if (!taskText.trim()) return;
    const newTask = {
      id: uuidv4(),
      task: taskText,
      completed: false,
      category: category,
      status: "To Do",
      deadline: deadline,
      priority: priority,
    };
    setTasks((prevTasks) => [...prevTasks, newTask]);
  };

  const toggleTask = (id) => {
    setTasks((prevTasks) =>
      prevTasks.map((task) =>
        task.id === id
          ? { ...task, completed: !task.completed, category: task.completed ? "To Do" : "Done" }
          : task
      )
    );
  };

  const editTask = (id, updates) => {
    setTasks((prevTasks) =>
      prevTasks.map((task) =>
        task.id === id ? { ...task, ...updates } : task
      )
    );
  };

  const deleteTask = (id) => {
    setTasks((prevTasks) => prevTasks.filter((task) => task.id !== id));
  };

  const onDragEnd = (result) => {
    const { source, destination, draggableId } = result;
    if (!destination || !isLoaded) return;
    if (source.droppableId === destination.droppableId && source.index === destination.index) return;

    setTasks((prevTasks) => {
      const tasksCopy = [...prevTasks];
      const taskIndex = tasksCopy.findIndex((task) => task.id === draggableId);
      const [destCategory] = destination.droppableId.split("-");
      const [movedTask] = tasksCopy.splice(taskIndex, 1);
      movedTask.category = destCategory;

      const destTasks = tasksCopy.filter((task) => task.category === destCategory);
      const insertIndex = Math.min(destination.index, destTasks.length);
      const firstDestTaskIndex = tasksCopy.findIndex((task) => task.category === destCategory);
      const finalInsertIndex = firstDestTaskIndex === -1 ? tasksCopy.length : firstDestTaskIndex + insertIndex;

      tasksCopy.splice(finalInsertIndex, 0, movedTask);
      return tasksCopy;
    });
  };

  if (!isLoaded) return <div className="loading">Загрузка...</div>;

  return (
    <div className="todo-container">
      <DragDropContext onDragEnd={onDragEnd}>
        <div className="category-section">
          {["To Do", "In Progress", "Done"].map((category) => (
            <TaskList
              key={category}
              category={category}
              tasks={tasks.filter((task) => task.category === category)}
              toggleTask={toggleTask}
              editTask={editTask}
              deleteTask={deleteTask}
              addTask={addTask}
            />
          ))}
        </div>
      </DragDropContext>
    </div>
  );
};

export default Todo;