import { useState, useEffect, useMemo } from "react";
import "./Timer.css";
import SettingsIcon from "/settings.png";
import { timerManager } from "./timerManager";

const PomodoroTimer = () => {
  const [timerState, setTimerState] = useState({
    seconds: timerManager.seconds,
    isRunning: timerManager.isRunning,
    mode: timerManager.mode,
    workTime: timerManager.workTime,
    breakTime: timerManager.breakTime,
    volume: timerManager.volume,
    cycleCount: timerManager.cycleCount,
  });
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  useEffect(() => {
    const updateState = () => {
      setTimerState({
        seconds: timerManager.seconds,
        isRunning: timerManager.isRunning,
        mode: timerManager.mode,
        workTime: timerManager.workTime,
        breakTime: timerManager.breakTime,
        volume: timerManager.volume,
        cycleCount: timerManager.cycleCount,
      });
    };

    timerManager.subscribe(updateState);

    // Set favicon dynamically if needed
    const link = document.querySelector("link[rel='icon']") || document.createElement("link");
    link.rel = "icon";
    link.href = "/icon.ico";
    document.head.appendChild(link);

    return () => {
      timerManager.unsubscribe(updateState);
      document.title = "Pomodoro Timer"; // Reset title on unmount
    };
  }, []);

  const playClickSound = () => {
    const clickSound = new Audio("/click.mp3");
    clickSound.volume = timerManager.volume;
    clickSound.play().catch((err) => console.error("Ошибка звука клика:", err));
  };

  const message = timerState.mode === "work" ? "Time to focus" : "Time to chill";
  const initialTime = useMemo(
    () => (timerState.mode === "work" ? timerState.workTime : timerState.breakTime),
    [timerState.mode, timerState.workTime, timerState.breakTime]
  );

  const validateAndSetTime = (time, defaultTime) => {
    const minutes = parseInt(time / 60);
    return !isNaN(minutes) && minutes >= 1 ? time : defaultTime;
  };

  const handleSaveSettings = () => {
    const validatedWorkTime = validateAndSetTime(timerState.workTime, 1500);
    const validatedBreakTime = validateAndSetTime(timerState.breakTime, 300);
    timerManager.setWorkTime(validatedWorkTime);
    timerManager.setBreakTime(validatedBreakTime);
    timerManager.setVolume(timerState.volume); // Ensure volume is saved
    setIsSettingsOpen(false);
  };

  const handleWorkTimeChange = (e) => {
    const value = e.target.value;
    setTimerState((prev) => ({
      ...prev,
      workTime: value === "" ? "" : parseInt(value) * 60,
    }));
  };

  const handleBreakTimeChange = (e) => {
    const value = e.target.value;
    setTimerState((prev) => ({
      ...prev,
      breakTime: value === "" ? "" : parseInt(value) * 60,
    }));
  };

  const handleWorkTimeBlur = () => {
    if (timerState.workTime === "" || isNaN(timerState.workTime) || timerState.workTime < 60) {
      setTimerState((prev) => ({ ...prev, workTime: 1500 }));
    }
  };

  const handleBreakTimeBlur = () => {
    if (timerState.breakTime === "" || isNaN(timerState.breakTime) || timerState.breakTime < 60) {
      setTimerState((prev) => ({ ...prev, breakTime: 300 }));
    }
  };

  const handleVolumeChange = (e) => {
    const newVolume = parseFloat(e.target.value);
    setTimerState((prev) => ({ ...prev, volume: newVolume }));
    timerManager.setVolume(newVolume); // Update volume in timerManager immediately
  };

  const progress = useMemo(
    () => ((initialTime - timerState.seconds) / initialTime) * 100,
    [initialTime, timerState.seconds]
  );

  return (
    <div className="timer-container">
      <p className="message">{message}</p>
      <h1>Pomodoro Timer</h1>
      <div className="progress">
        <div className="progress-inner" style={{ width: `${progress}%` }}></div>
      </div>
      <p className="timer">{`${Math.floor(timerState.seconds / 60)}:${(timerState.seconds % 60)
        .toString()
        .padStart(2, "0")}`}</p>
      <div className="button-group">
        <button className="button" onClick={() => { playClickSound(); timerManager.start(); }}>
          Start
        </button>
        <button className="button" onClick={() => { playClickSound(); timerManager.stop(); }}>
          Stop
        </button>
        <button className="button" onClick={() => { playClickSound(); timerManager.reset(); }}>
          Reset
        </button>
        <button className="settings-button" onClick={() => { playClickSound(); setIsSettingsOpen(true); }}>
          <img src={SettingsIcon} alt="Settings" />
        </button>
      </div>
      <div className="cycle-counter">
        <p className="completed">Completed Cycles: {timerState.cycleCount}</p>
        <button className="button-cycle" onClick={() => { playClickSound(); timerManager.resetCycles(); }}>
          Reset Cycles
        </button>
      </div>
      {isSettingsOpen && (
        <div className="modal" onClick={() => setIsSettingsOpen(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h2>Timer Settings</h2>
            <div className="settings-row">
              <label>Work Time (min):</label>
              <input
                type="number"
                value={timerState.workTime === "" ? "" : timerState.workTime / 60}
                onChange={handleWorkTimeChange}
                onBlur={handleWorkTimeBlur}
                min="1"
                step="1"
                className="settings-input"
              />
            </div>
            <div className="settings-row">
              <label>Break Time (min):</label>
              <input
                type="number"
                value={timerState.breakTime === "" ? "" : timerState.breakTime / 60}
                onChange={handleBreakTimeChange}
                onBlur={handleBreakTimeBlur}
                min="1"
                step="1"
                className="settings-input"
              />
            </div>
            <div className="settings-row">
              <label>Volume:</label>
              <input
                type="range"
                min="0"
                max="1"
                step="0.1"
                value={timerState.volume}
                onChange={handleVolumeChange} // Update volume immediately
                className="volume-slider"
              />
            </div>
            <div className="modal-buttons">
              <button className="save-button" onClick={handleSaveSettings}>
                Save
              </button>
              <button className="close-button" onClick={() => setIsSettingsOpen(false)}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PomodoroTimer;