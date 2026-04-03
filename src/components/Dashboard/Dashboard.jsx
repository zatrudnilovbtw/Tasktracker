import React, { useState, useEffect } from "react";
import "./Dashboard.css";
import { PieChart } from "react-minimal-pie-chart";
import { timerManager } from "../Timer/timerManager"; // Убедись, что путь правильный

const Dashboard = () => {
  const [tasks, setTasks] = useState([]);
  const [timerState, setTimerState] = useState({
    seconds: timerManager.seconds,
    isRunning: timerManager.isRunning,
    mode: timerManager.mode,
    cycleCount: timerManager.cycleCount,
  });

  // Загружаем задачи из localStorage
  useEffect(() => {
    const savedTasks = localStorage.getItem("tasks");
    if (savedTasks) {
      setTasks(JSON.parse(savedTasks));
    }
  }, []);

  // Подписка на обновления таймера
  useEffect(() => {
    const updateTimerState = () => {
      setTimerState({
        seconds: timerManager.seconds,
        isRunning: timerManager.isRunning,
        mode: timerManager.mode,
        cycleCount: timerManager.cycleCount,
      });
    };
    timerManager.subscribe(updateTimerState);
    return () => timerManager.unsubscribe(updateTimerState); // Очистка при размонтировании
  }, []);

  const taskStats = {
    toDo: tasks.filter((task) => task.category === "К выполнению").length,
    inProgress: tasks.filter((task) => task.category === "В процессе").length,
    done: tasks.filter((task) => task.category === "Выполнено").length,
  };

  const pieData = [
    { title: "К выполнению", value: taskStats.toDo, color: "#4a90e2" },
    { title: "В процессе", value: taskStats.inProgress, color: "#ffd700" },
    { title: "Выполнено", value: taskStats.done, color: "#28a745" },
  ].filter((item) => item.value > 0);

  return (
    <div className="dashboard-container">
      <h1>Статистика</h1>
      <div className="dashboard-content">
        <div className="task-stats">
          <div className="stats-text">
            <p style={{ color: "#4a90e2" }}>К выполнению: {taskStats.toDo}</p>
            <p style={{ color: "#ffd700" }}>В процессе: {taskStats.inProgress}</p>
            <p style={{ color: "#28a745" }}>Выполнено: {taskStats.done}</p>
          </div>
          <div className="pie-chart-wrapper">
            <PieChart
              data={pieData}
              lineWidth={30}
              radius={40}
              paddingAngle={5}
            />
          </div>
        </div>
        <div className="pomodoro-progress">
          <h2>Прогресс Помодоро</h2>
          <div className="pomodoro-widget">
            <p>
              Режим: {timerState.mode === "work" ? "Работа" : "Перерыв"}{" "}
              - {Math.floor(timerState.seconds / 60)}:
              {(timerState.seconds % 60).toString().padStart(2, "0")}
            </p>
            <p>Циклов сегодня: {timerState.cycleCount}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;