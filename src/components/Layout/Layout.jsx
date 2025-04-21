import { useState } from "react";
import "./Layout.css";
import { FaRegClipboard } from "react-icons/fa";
import { CgNotes } from "react-icons/cg";
import { GrTask } from "react-icons/gr";
import { TfiTimer } from "react-icons/tfi";
import { SlPencil } from "react-icons/sl";
import { IoMenu, IoClose } from "react-icons/io5"; // Добавляем IoClose

const Layout = ({ dashboard, todo, notes, pomadoro, desk }) => {
  const [activePage, setActivePage] = useState("dashboard");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const handlePageChange = (page) => {
    setActivePage(page);
    setIsSidebarOpen(false);
  };

  const renderContent = () => {
    switch (activePage) {
      case "dashboard":
        return dashboard;
      case "todo":
        return todo;
      case "notes":
        return notes;
      case "desk":
        return desk;
      case "pomadoro":
        return pomadoro;
      default:
        return <h1>Страница не найдена</h1>;
    }
  };

  return (
    <div className="layout-container">
      <button
        className="sidebar-toggle"
        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
      >
        {isSidebarOpen ? <IoClose size={23} /> : <IoMenu size={23} />}
      </button>
      <aside
        className={`sidebar ${isSidebarOpen ? "open" : ""}`}
        onClick={(e) => {
          if (e.target === e.currentTarget) setIsSidebarOpen(false);
        }}
      >
        <h2>TrackIT</h2>
        <ul>
          <li onClick={() => handlePageChange("dashboard")}>
            <span className="icon">
              <FaRegClipboard /> Dashboard
            </span>
          </li>
          <li onClick={() => handlePageChange("todo")}>
            <span className="icon">
              <GrTask /> Tasks
            </span>
          </li>
          <li onClick={() => handlePageChange("notes")}>
            <span className="icon">
              <CgNotes /> Notes
            </span>
          </li>
          <li onClick={() => handlePageChange("desk")}>
            <span className="icon">
            <SlPencil /> Whiteboard
            </span>
          </li>
          <li onClick={() => handlePageChange("pomadoro")}>
            <span className="icon">
              <TfiTimer /> Pomodoro
            </span>
          </li>
        </ul>
      </aside>
      <main className="main-content">{renderContent()}</main>
    </div>
  );
};

export default Layout;