import React, { useState, useEffect, useRef } from "react";
import { Draggable } from "react-beautiful-dnd";
import { RiExpandDiagonal2Line, RiCollapseDiagonal2Line } from "react-icons/ri";
import { BsThreeDotsVertical } from "react-icons/bs";
import "./NoteItem.css";

const NoteItem = ({ note, toggleNote, index, onEdit, onDelete }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleMenuToggle = (e) => {
    e.stopPropagation();
    setIsMenuOpen((prev) => !prev);
  };

  const handleEdit = () => {
    onEdit(note);
    setIsMenuOpen(false);
  };

  const handleDelete = (e) => {
    e.stopPropagation();
    console.log("Deleting note with id:", note.id); // Добавляем лог для проверки
    onDelete(note.id); // Передаем id заметки
    setIsMenuOpen(false);
  };

  const getFirstLine = (content) => {
    if (!content) return "Нет текста";
    const lines = content.split("\n");
    return lines[0] || "Нет текста";
  };

  return (
    <Draggable draggableId={note.id} index={index}>
      {(provided) => (
        <div
          className={`note-item ${note.isExpanded ? "expanded" : ""}`}
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          style={{ borderColor: note.color, ...provided.draggableProps.style }}
        >
          <div className="note-header" onClick={() => toggleNote(note.id)}>
            <h3>{note.title}</h3>
            <span>{new Date(note.createdAt).toLocaleDateString()}</span>
          </div>
          <BsThreeDotsVertical className="menu-icon" onClick={handleMenuToggle} />
          {isMenuOpen && (
            <div className="dropdown-menu" ref={menuRef}>
              <div className="dropdown-item" onClick={handleEdit}>
                Редактировать
              </div>
              <div className="dropdown-item" onClick={handleDelete}>
                Удалить
              </div>
            </div>
          )}
          {!note.isExpanded && (
            <div className="note-preview">
              <p>{getFirstLine(note.content)}</p>
            </div>
          )}
          {note.isExpanded && (
            <div className="note-content">
              <p>{note.content || "Нет текста"}</p>
            </div>
          )}
          <div className="toggle-icon" onClick={() => toggleNote(note.id)}>
            {note.isExpanded ? <RiCollapseDiagonal2Line /> : <RiExpandDiagonal2Line />}
          </div>
        </div>
      )}
    </Draggable>
  );
};

export default NoteItem;