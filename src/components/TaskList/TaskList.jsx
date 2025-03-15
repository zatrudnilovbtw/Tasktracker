import React, { useState } from "react";
import TaskItem from "../TaskItem/TaskItem.jsx";
import { Droppable } from "react-beautiful-dnd";
import { IoAdd } from "react-icons/io5";
import "./TaskList.css"; // Локальный CSS

const TaskList = ({
  category,
  tasks,
  toggleTask,
  editTask,
  deleteTask,
  addTask,
}) => {
  const [isAdding, setIsAdding] = useState(false);
  const [newTaskText, setNewTaskText] = useState("");
  const [newDeadline, setNewDeadline] = useState("");
  const [newPriority, setNewPriority] = useState("Low");

  const handleAddTask = () => {
    if (newTaskText.trim()) {
      addTask(category, newTaskText, newDeadline || null, newPriority);
      setNewTaskText("");
      setNewDeadline("");
      setNewPriority("Low");
      setIsAdding(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.ctrlKey) {
      e.preventDefault();
      handleAddTask();
    } else if (e.key === "Enter" && e.ctrlKey) {
      setNewTaskText(newTaskText + "\n");
    }
  };

  const cancelAddTask = () => {
    setIsAdding(false);
    setNewTaskText("");
    setNewDeadline("");
    setNewPriority("Low");
  };

  const sortedTasks = tasks.sort((a, b) => {
    const priorityOrder = { High: 1, Medium: 2, Low: 3 };
    return priorityOrder[a.priority] - priorityOrder[b.priority];
  });

  return (
    <div className="category-container">
      <div className="category-header">
        <h2 className="category-title">{category} ({tasks.length})</h2>
      </div>
      {/* Кнопка и форма добавления вне Droppable */}
      <div className="add-task-section">
        {isAdding ? (
          <div className="task-form">
            <textarea
              value={newTaskText}
              onChange={(e) => setNewTaskText(e.target.value)}
              placeholder="Введите задачу"
              onKeyDown={handleKeyPress}
              autoFocus
            />
            <input
              type="date"
              value={newDeadline}
              onChange={(e) => setNewDeadline(e.target.value)}
            />
            <select
              value={newPriority}
              onChange={(e) => setNewPriority(e.target.value)}
            >
              <option value="High">High</option>
              <option value="Medium">Medium</option>
              <option value="Low">Low</option>
            </select>
            <div className="task-form-actions">
              <button onClick={handleAddTask}>Сохранить</button>
              <button onClick={cancelAddTask}>Отмена</button>
            </div>
          </div>
        ) : (
          <button
            className="add-task-button"
            onClick={() => setIsAdding(true)}
          >
            <IoAdd /> Добавить задачу
          </button>
        )}
      </div>
      {/* Зона перетаскивания только для списка задач */}
      <Droppable droppableId={`${category}`}>
        {(provided) => (
          <div
            className="kanban-column"
            ref={provided.innerRef}
            {...provided.droppableProps}
          >
            <ul>
              {sortedTasks.map((task, index) => (
                <TaskItem
                  key={task.id}
                  task={task}
                  toggleTask={toggleTask}
                  editTask={editTask}
                  deleteTask={deleteTask}
                  index={index}
                />
              ))}
              {provided.placeholder}
            </ul>
          </div>
        )}
      </Droppable>
    </div>
  );
};

export default TaskList;