import React, { useState, useRef, useEffect } from "react";
import { Draggable } from "react-beautiful-dnd";
import { IoClose, IoReorderThree, IoCalendarOutline } from "react-icons/io5"; // Добавляем иконку календаря
import "./TaskItem.css";

const TaskItem = ({ task, toggleTask, editTask, deleteTask, index }) => {
  const [editText, setEditText] = useState(task.task);
  const [editDeadline, setEditDeadline] = useState(task.deadline || "");
  const [editPriority, setEditPriority] = useState(task.priority);
  const [showPriorityOptions, setShowPriorityOptions] = useState(false);
  const [isEditingDeadline, setIsEditingDeadline] = useState(false); // Новое состояние для редактирования даты
  const textareaRef = useRef(null);

  const formatDate = (dateStr) => {
    if (!dateStr) return "Нет даты";
    const [year, month, day] = dateStr.split("-");
    return `${day}.${month}.${year}`;
  };

  const handleTextChange = (e) => {
    setEditText(e.target.value);
    adjustTextareaHeight();
  };

  const handleTextBlur = () => {
    if (editText.trim() && editText !== task.task) {
      editTask(task.id, { ...task, task: editText });
    } else {
      setEditText(task.task);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.ctrlKey) {
      e.preventDefault();
      handleTextBlur();
      textareaRef.current.blur();
    } else if (e.key === "Enter" && e.ctrlKey) {
      setEditText(editText + "\n");
    }
  };

  const handleDeadlineChange = (e) => {
    const newDeadline = e.target.value;
    setEditDeadline(newDeadline);
  };

  const saveDeadline = () => {
    editTask(task.id, { ...task, deadline: editDeadline || null });
    setIsEditingDeadline(false); // Завершаем редактирование
  };

  const handleDeadlineBlur = () => {
    saveDeadline();
  };

  const handleDeadlineKeyDown = (e) => {
    if (e.key === "Enter") {
      saveDeadline();
    } else if (e.key === "Escape") {
      setEditDeadline(task.deadline || ""); // Отмена изменений
      setIsEditingDeadline(false);
    }
  };

  const handlePriorityChange = (newPriority) => {
    setEditPriority(newPriority);
    editTask(task.id, { ...task, priority: newPriority });
    setShowPriorityOptions(false);
  };

  const adjustTextareaHeight = () => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = "auto";
      textarea.style.height = `${textarea.scrollHeight}px`;
    }
  };

  useEffect(() => {
    adjustTextareaHeight();
  }, [editText]);

  return (
    <Draggable draggableId={task.id} index={index}>
      {(provided, snapshot) => (
        <li
          className={`task-item ${task.completed ? "completed" : ""} ${
            snapshot.isDragging ? "draggable" : ""
          }`}
          ref={provided.innerRef}
          {...provided.draggableProps}
        >
          <input
            type="checkbox"
            checked={task.completed}
            onChange={() => toggleTask(task.id)}
            className="task-checkbox"
          />
          <div className="task-content">
            <textarea
              ref={textareaRef}
              value={editText}
              onChange={handleTextChange}
              onBlur={handleTextBlur}
              onKeyDown={handleKeyDown}
              className="task-text-input"
              autoFocus={editText !== task.task}
            />
            <div className="task-details">
              <span className="task-deadline-container">
                {isEditingDeadline ? (
                  <input
                    type="date"
                    value={editDeadline}
                    onChange={handleDeadlineChange}
                    onBlur={handleDeadlineBlur}
                    onKeyDown={handleDeadlineKeyDown}
                    className="task-deadline-input"
                    autoFocus
                  />
                ) : (
                  <span
                    className="task-deadline"
                    onClick={() => setIsEditingDeadline(true)}
                  >
                    <IoCalendarOutline className="calendar-icon" />{" "}
                    {formatDate(editDeadline)}
                  </span>
                )}
              </span>
              <div className="priority-container">
                <span
                  className={`task-priority priority-${editPriority.toLowerCase()}`}
                  onClick={() => setShowPriorityOptions(!showPriorityOptions)}
                >
                  {editPriority}
                </span>
                {showPriorityOptions && (
                  <div className="priority-options">
                    {["High", "Medium", "Low"]
                      .filter((p) => p !== editPriority)
                      .map((priority) => (
                        <span
                          key={priority}
                          className={`task-priority priority-${priority.toLowerCase()}`}
                          onClick={() => handlePriorityChange(priority)}
                        >
                          {priority}
                        </span>
                      ))}
                  </div>
                )}
              </div>
            </div>
          </div>
          <div className="task-actions">
            <IoClose
              onClick={() => deleteTask(task.id)}
              className="icon icon-delete"
            />
            <span className="drag-handle" {...provided.dragHandleProps}>
              <IoReorderThree className="icon icon-drag" />
            </span>
          </div>
        </li>
      )}
    </Draggable>
  );
};

export default TaskItem;