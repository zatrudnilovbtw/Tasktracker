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
    toDo: tasks.filter((task) => task.category === "To Do").length,
    inProgress: tasks.filter((task) => task.category === "In Progress").length,
    done: tasks.filter((task) => task.category === "Done").length,
  };

  const pieData = [
    { title: "To Do", value: taskStats.toDo, color: "#4a90e2" },
    { title: "In Progress", value: taskStats.inProgress, color: "#ffd700" },
    { title: "Done", value: taskStats.done, color: "#28a745" },
  ].filter((item) => item.value > 0);

  return (
    <div className="dashboard-container">
      <h1>Statistics</h1>
      <div className="dashboard-content">
        <div className="task-stats">
          <div className="stats-text">
            <p style={{ color: "#4a90e2" }}>To Do: {taskStats.toDo}</p>
            <p style={{ color: "#ffd700" }}>In Progress: {taskStats.inProgress}</p>
            <p style={{ color: "#28a745" }}>Done: {taskStats.done}</p>
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
          <h2>Pomodoro Progress</h2>
          <div className="pomodoro-widget">
            <p>
              Mode: {timerState.mode.charAt(0).toUpperCase() + timerState.mode.slice(1)}{" "}
              - {Math.floor(timerState.seconds / 60)}:
              {(timerState.seconds % 60).toString().padStart(2, "0")}
            </p>
            <p>Cycles Today: {timerState.cycleCount}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;