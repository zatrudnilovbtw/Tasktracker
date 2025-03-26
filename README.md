# ZatruTracker

A productivity web app combining task management, a Pomodoro timer, and a dashboard for tracking progress. Organize tasks in a Kanban-style board, use the Pomodoro technique to stay focused, and visualize your stats with a pie chart.

## Live Demo
Check it out here: [ZatruTracker](https://zatrutracker.netlify.app)

## Features
- **Task Management**: Kanban board with "To Do", "In Progress", and "Done" columns
  - Drag-and-drop tasks between categories
  - Add, edit, and delete tasks with deadlines and priorities (High, Medium, Low)
  - Search functionality with real-time filtering
  - Persistent storage in localStorage
- **Pomodoro Timer**: Customizable work and break intervals
  - Audio notifications and cycle counter
  - Progress bar and settings for duration/volume
  - Shared state via `timerManager` singleton
- **Dashboard**: Visual stats overview
  - Pie chart showing task distribution
  - Real-time Pomodoro progress display
- Responsive sidebar navigation with icons
- Smooth animations and modern UI

## How to Use
1. Visit the [live demo](https://zatrutracker.netlify.app).
2. Navigate via the sidebar:
   - **Dashboard**: View task stats and Pomodoro progress
   - **Task**: Manage tasks with drag-and-drop
   - **Pomodoro**: Start/stop the timer and adjust settings
3. Add tasks, set priorities/deadlines, and track your productivity.

## Files
- `Dashboard.jsx` / `Dashboard.css`: Stats and pie chart visualization
- `Layout.jsx` / `Layout.css`: Sidebar and main layout
- `TaskItem.jsx` / `TaskItem.css`: Individual task component
- `TaskList.jsx` / `TaskList.css`: Task category column
- `Timer.jsx` / `Timer.css`: Pomodoro timer component
- `timerManager.js`: Singleton for timer state management
- `Todo.jsx` / `Todo.css`: Main task management view

## Technologies
- React for UI and state management
- `react-beautiful-dnd` for drag-and-drop functionality
- `react-minimal-pie-chart` for visualizations
- CSS with custom animations
- Hosted on Netlify

Created by Zatrudnilov.
