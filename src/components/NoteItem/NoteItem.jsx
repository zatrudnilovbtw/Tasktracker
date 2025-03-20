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
    console.log("Deleting note with id:", note.id);
    onDelete(note.id);
    setIsMenuOpen(false);
  };

  const getFirstLine = (content) => {
    if (!content) return "Нет текста";
    const lines = content.split("\n");
    return lines[0] || "Нет текста";
  };

  const renderContent = (text) => {
    if (!text) return "Нет текста";
    const urlPattern = /(https?:\/\/[^\s]+)/g;
    // Разделяем текст по переносам строк и URL
    return text.split("\n").map((line, lineIndex) => (
      <span key={lineIndex}>
        {line.split(urlPattern).map((part, index) => {
          if (part.match(urlPattern)) {
            return (
              <a
                key={`${lineIndex}-${index}`}
                href={part}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => e.stopPropagation()}
              >
                {part}
              </a>
            );
          }
          return part;
        })}
        {lineIndex < text.split("\n").length - 1 && <br />} {/* Добавляем перенос строки */}
      </span>
    ));
  };

  return (
    <Draggable draggableId={note.id} index={index}>
      {(provided) => (
        <div
          className={`note-item ${note.isExpanded ? "expanded" : ""}`}
          ref={provided.innerRef}
          {...provided.draggableProps}
          style={{ borderColor: note.color, ...provided.draggableProps.style }}
        >
          <div
            className="note-header"
            {...provided.dragHandleProps}
            onClick={() => toggleNote(note.id)}
          >
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
            <div className="note-preview" style={{ userSelect: "text" }}>
              <p>{renderContent(getFirstLine(note.content))}</p>
            </div>
          )}
          {note.isExpanded && (
            <div className="note-content" style={{ userSelect: "text" }}>
              <p>{renderContent(note.content)}</p>
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