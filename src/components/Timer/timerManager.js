class TimerManager {
  constructor() {
    this.seconds = 0;
    this.isRunning = false;
    this.mode = "work";
    this.workTime = 1500;
    this.breakTime = 300;
    this.volume = 0.5;
    this.cycleCount = 0;
    this.callbacks = [];
    this.intervalId = null;
    this.loadFromStorage();
    this.updateTitle(); // Set initial title
  }

  loadFromStorage() {
    this.seconds = parseInt(localStorage.getItem("seconds")) || this.workTime;
    this.isRunning = localStorage.getItem("isRunning") === "true";
    this.mode = localStorage.getItem("mode") || "work";
    this.workTime = parseInt(localStorage.getItem("workTime")) || 1500;
    this.breakTime = parseInt(localStorage.getItem("breakTime")) || 300;
    this.volume = parseFloat(localStorage.getItem("volume")) || 0.5;
    this.cycleCount = parseInt(localStorage.getItem("cycleCount")) || 0;
    if (this.isRunning) this.start(); // Resume timer if it was running
  }

  saveToStorage() {
    localStorage.setItem("seconds", this.seconds);
    localStorage.setItem("isRunning", this.isRunning);
    localStorage.setItem("mode", this.mode);
    localStorage.setItem("workTime", this.workTime);
    localStorage.setItem("breakTime", this.breakTime);
    localStorage.setItem("volume", this.volume);
    localStorage.setItem("cycleCount", this.cycleCount);
  }

  subscribe(callback) {
    this.callbacks.push(callback);
  }

  unsubscribe(callback) {
    this.callbacks = this.callbacks.filter((cb) => cb !== callback);
  }

  notify() {
    this.callbacks.forEach((cb) => cb(this));
  }

  updateTitle() {
    const minutes = Math.floor(this.seconds / 60);
    const seconds = this.seconds % 60;
    const timeString = `${minutes}:${seconds.toString().padStart(2, "0")}`;
    document.title = `${timeString} - ${this.mode === "work" ? "Work" : "Break"}`;
  }

  start() {
    if (!this.isRunning) {
      this.isRunning = true;
      this.intervalId = setInterval(() => this.tick(), 1000);
      this.saveToStorage();
      this.notify();
    }
  }

  stop() {
    this.isRunning = false;
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
    this.saveToStorage();
    this.notify();
    this.updateTitle(); // Update title when stopped
  }

  reset() {
    this.seconds = this.mode === "work" ? this.workTime : this.breakTime;
    this.isRunning = false;
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
    this.saveToStorage();
    this.notify();
    this.updateTitle(); // Update title when reset
  }

  setWorkTime(time) {
    this.workTime = time;
    if (this.mode === "work" && !this.isRunning) this.seconds = time;
    this.saveToStorage();
    this.notify();
    this.updateTitle(); // Update title when work time changes
  }

  setBreakTime(time) {
    this.breakTime = time;
    if (this.mode === "break" && !this.isRunning) this.seconds = time;
    this.saveToStorage();
    this.notify();
    this.updateTitle(); // Update title when break time changes
  }

  setVolume(volume) {
    this.volume = volume;
    this.saveToStorage();
  }

  resetCycles() {
    this.cycleCount = 0;
    this.saveToStorage();
    this.notify();
  }

  tick() {
    if (!this.isRunning) return;

    this.seconds = Math.max(this.seconds - 1, 0);

    if (this.seconds === 0) {
      const endSound = new Audio("/end.mp3");
      endSound.volume = this.volume;
      endSound.play().catch((err) => console.error("Ошибка звука:", err));

      if (this.mode === "work") {
        this.mode = "break";
        this.seconds = this.breakTime;
        this.cycleCount += 1;
      } else {
        this.mode = "work";
        this.seconds = this.workTime;
      }
      this.isRunning = false;
      if (this.intervalId) {
        clearInterval(this.intervalId);
        this.intervalId = null;
      }
    }
    this.saveToStorage();
    this.notify();
    this.updateTitle(); // Update title every tick
  }
}

export const timerManager = new TimerManager();