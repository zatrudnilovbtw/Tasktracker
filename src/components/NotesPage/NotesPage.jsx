import { useState } from "react";
import { IoAdd, IoSearch, IoClose } from "react-icons/io5";
import { v4 as uuidv4 } from "uuid";
import { DragDropContext, Droppable } from "react-beautiful-dnd";
import NoteItem from "../NoteItem/NoteItem";
import "./NotesPage.css";

const NotesPage = ({ notes, setNotes }) => { // Убраны onEdit и onDelete из пропсов, так как они будут внутри
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newContent, setNewContent] = useState("");
  const [newColor, setNewColor] = useState("#333");
  const [searchQuery, setSearchQuery] = useState("");
  const [editNoteId, setEditNoteId] = useState(null);

  const addNote = () => {
    setIsFormOpen(true);
    setEditNoteId(null);
    setNewTitle("");
    setNewContent("");
    setNewColor("#333");
  };

  const handleEdit = (note) => {
    setIsFormOpen(true);
    setEditNoteId(note.id);
    setNewTitle(note.title);
    setNewContent(note.content);
    setNewColor(note.color);
  };

  const handleDelete = (id) => {
    setNotes((prev) => prev.filter((note) => note.id !== id));
  };

  const handleSaveNote = () => {
    if (!newTitle.trim() && !newContent.trim()) return;

    const noteData = {
      id: editNoteId || uuidv4(),
      title: newTitle || "Без заголовка",
      content: newContent,
      color: newColor,
      createdAt: editNoteId
        ? notes.find((n) => n.id === editNoteId)?.createdAt
        : new Date().toISOString(),
      isExpanded: false,
    };

    if (editNoteId) {
      setNotes((prev) =>
        prev.map((note) => (note.id === editNoteId ? noteData : note))
      );
    } else {
      setNotes((prev) => [...prev, noteData]);
    }

    resetForm();
  };

  const resetForm = () => {
    setNewTitle("");
    setNewContent("");
    setNewColor("#333");
    setIsFormOpen(false);
    setEditNoteId(null);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.ctrlKey) {
      e.preventDefault();
      handleSaveNote();
    } else if (e.key === "Enter" && e.ctrlKey) {
      e.preventDefault();
      setNewContent((prev) => prev + "\n");
    }
  };

  const toggleNote = (id) => {
    setNotes((prev) =>
      prev.map((note) =>
        note.id === id ? { ...note, isExpanded: !note.isExpanded } : note
      )
    );
  };

  const onDragEnd = (result) => {
    const { source, destination } = result;
    if (!destination || source.index === destination.index) return;
    const newNotes = [...notes];
    const [movedNote] = newNotes.splice(source.index, 1);
    newNotes.splice(destination.index, 0, movedNote);
    setNotes(newNotes);
  };

  const filteredNotes = notes.filter(
    (note) =>
      note.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      note.content.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="notes-page-container">
      <div className="notes-header">
        <button className="add-note-button" onClick={addNote}>
          <IoAdd /> Создать заметку
        </button>
        <div className="search-container">
          <IoSearch className="search-icon" />
          <input
            type="text"
            placeholder="Поиск заметок..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="search-input2"
          />
          {searchQuery && (
            <IoClose
              className="clear-icon"
              onClick={() => setSearchQuery("")}
            />
          )}
        </div>
      </div>

      {isFormOpen && (
        <div className="modal">
          <div className="note-form">
            <input
              type="text"
              placeholder="Заголовок"
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              onKeyDown={handleKeyDown}
              className="note-form-input"
            />
            <textarea
              placeholder="Текст заметки"
              value={newContent}
              onChange={(e) => setNewContent(e.target.value)}
              onKeyDown={handleKeyDown}
              className="note-form-textarea"
            />
            <div className="color-picker">
              {[
                "#333",
                "#ff6b6b",
                "#4ecdc4",
                "#45b7d1",
                "#96c93d",
                "#f7d794",
                "#ff9ff3",
                "#5e60ce",
                "#ffca3a",
                "#48cae4",
              ].map((color) => (
                <div
                  key={color}
                  className={`color-option ${
                    newColor === color ? "selected" : ""
                  }`}
                  style={{ backgroundColor: color }}
                  onClick={() => setNewColor(color)}
                />
              ))}
            </div>
            <div className="note-form-actions">
              <button onClick={handleSaveNote} className="save-button">
                Сохранить
              </button>
              <button onClick={resetForm} className="cancel-button">
                Отмена
              </button>
            </div>
          </div>
        </div>
      )}

      <DragDropContext onDragEnd={onDragEnd}>
        <Droppable droppableId="notes" direction="horizontal">
          {(provided) => (
            <div
              className="notes-container"
              ref={provided.innerRef}
              {...provided.droppableProps}
            >
              {filteredNotes.length ? (
                filteredNotes.map((note, index) => (
                  <NoteItem
                    key={note.id}
                    note={note}
                    toggleNote={toggleNote}
                    index={index}
                    onEdit={handleEdit} // Передаем функцию handleEdit
                    onDelete={handleDelete} // Передаем функцию handleDelete
                  />
                ))
              ) : (
                <div className="no-notes">Ничего не найдено</div>
              )}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>
    </div>
  );
};

export default NotesPage;