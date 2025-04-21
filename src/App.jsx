import { useState, useEffect } from "react"; // Добавляем useEffect
import Layout from "./components/Layout/Layout";
import Todo from "./components/Todo/Todo";
import Dashboard from "./components/Dashboard/Dashboard";
import PomodoroTimer from "./components/Timer/Timer";
import NotesPage from "./components/NotesPage/NotesPage";
import Desk from "./components/Desk/Desk";

function App() {
  const [count, setCount] = useState(0);
  const [notes, setNotes] = useState([]);

  // Загружаем заметки из localStorage при монтировании
  useEffect(() => {
    const savedNotes = localStorage.getItem("notes");
    if (savedNotes) {
      setNotes(JSON.parse(savedNotes));
    }
  }, []);

  // Сохраняем заметки в localStorage при каждом изменении
  useEffect(() => {
    console.log("Saving notes to localStorage:", notes);
    localStorage.setItem("notes", JSON.stringify(notes));
  }, [notes]);

  const handleEdit = (note) => {
    // Логика редактирования уже в NotesPage
  };

  const handleDelete = (id) => {
    console.log("Deleting note with id:", id);
    setNotes((prev) => {
      const updatedNotes = prev.filter((note) => note.id !== id);
      console.log("Updated notes after delete:", updatedNotes);
      return updatedNotes;
    });
  };

  return (
    <Layout
      dashboard={<Dashboard />}
      todo={<Todo />}
      notes={<NotesPage notes={notes} setNotes={setNotes} onEdit={handleEdit} onDelete={handleDelete} />}
      desk={<Desk />}
      pomadoro={<PomodoroTimer />}
    />
  );
}

export default App;