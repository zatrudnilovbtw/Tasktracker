import React, { useState } from "react";
import TaskItem from "./TaskItem";
import { Droppable } from "react-beautiful-dnd";
import { IoAdd } from "react-icons/io5";

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

  return (
    <div className="category-container">
      <div className="category-header">
        <h2 className="category-title">{category} ({tasks.length})</h2>
      </div>
      <Droppable droppableId={`${category}`}>
        {(provided) => (
          <div
            className="kanban-column"
            ref={provided.innerRef}
            {...provided.droppableProps}
          >
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
            <ul>
              {tasks.map((task, index) => (
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