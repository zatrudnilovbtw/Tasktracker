import { useState } from "react";
import "./Layout.css";
import { FaRegWindowMaximize } from "react-icons/fa";
import { GrTask } from "react-icons/gr";
import { IoClipboardOutline } from "react-icons/io5";
import { TfiTimer } from "react-icons/tfi";
import { VscSettingsGear } from "react-icons/vsc";

const Layout = ({ children }) => {
  const [activePage, setActivePage] = useState("todo");

  const renderContent = () => {
    switch (activePage) {
      case "dashboard":
        return <h1>Dashboard (в разработке)</h1>;
      case "todo":
        return children;
      case "whiteboard":
        return <h1>Whiteboard (в разработке)</h1>;
      case "pomadoro":
        return <h1>Pomadoro (в разработке)</h1>;
      case "settings":
        return <h1>Настройки (в разработке)</h1>;
      default:
        return <h1>Страница не найдена</h1>;
    }
  };
  return (
    <div className="layout-container">
      <aside className="sidebar">
        <h2>ZATRUtracker </h2>
        <ul>
          <li onClick={() => setActivePage("dashboard")}>
            <span className="icon">
              <FaRegWindowMaximize  /> Dashboard
            </span>
          </li>
          <li onClick={() => setActivePage("todo")}>
            <span className="icon">
              <GrTask  /> Task
            </span>
          </li>
          <li onClick={() => setActivePage("whiteboard")}>
            <span className="icon">
              <IoClipboardOutline /> Whiteboard
            </span>
          </li>
          <li onClick={() => setActivePage("pomadoro")}>
            <span className="icon">
              <TfiTimer /> Pomadoro
            </span>
          </li>
          <li onClick={() => setActivePage("settings")}>
            <span className="icon">
              <VscSettingsGear /> Setiings
            </span>
          </li>
        </ul>
      </aside>
      <main className="main-content">{renderContent()}</main>
    </div>
  );
};

export default Layout;
