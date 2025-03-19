import { useState } from "react";
import "./Layout.css";
import { FaRegClipboard } from "react-icons/fa";
import { CgNotes } from "react-icons/cg";
import { GrTask } from "react-icons/gr";
import { TfiTimer } from "react-icons/tfi";
import { IoMenu } from "react-icons/io5"; // Иконка бургера

const Layout = ({ dashboard, todo, notes, pomadoro, settings }) => {
  const [activePage, setActivePage] = useState("dashboard"); // Начальное значение "dashboard"
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const handlePageChange = (page) => {
    setActivePage(page);
    setIsSidebarOpen(false); // Закрываем сайдбар при выборе страницы
  };

  const renderContent = () => {
    switch (activePage) {
      case "dashboard":
        return dashboard;
      case "todo":
        return todo;
      case "notes":
        return notes;
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
        <IoMenu size={24} />
      </button>
      <aside className={`sidebar ${isSidebarOpen ? "open" : ""}`}>
        <h2>TrackIT</h2>
        <ul>
          <li onClick={() => handlePageChange("dashboard")}>
            <span className="icon">
              <FaRegClipboard /> Dashboard
            </span>
          </li>
          <li onClick={() => handlePageChange("todo")}>
            <span className="icon">
              <GrTask /> Task
            </span>
          </li>
          <li onClick={() => handlePageChange("notes")}>
            <span className="icon">
              <CgNotes /> Notes
            </span>
          </li>
          <li onClick={() => handlePageChange("pomadoro")}>
            <span className="icon">
              <TfiTimer /> Pomadoro
            </span>
          </li>
        </ul>
      </aside>
      <main className="main-content">{renderContent()}</main>
    </div>
  );
};

export default Layout;