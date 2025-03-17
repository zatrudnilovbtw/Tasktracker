import { useState } from "react";
import Layout from './components/Layout/Layout';
import Todo from "./components/Todo/Todo";
import Dashboard from "./components/Dashboard/Dashboard";
import PomodoroTimer from './components/Timer/Timer'; // Импортируем, если нужно

function App() {
  const [count, setCount] = useState(0);

  return (
    <Layout
      dashboard={<Dashboard />}
      todo={<Todo />}
      notes={<h1>Заметки (в разработке)</h1>}
      pomadoro={<PomodoroTimer />}
      settings={<h1>Настройки (в разработке)</h1>}
    />
  );
}

export default App;