package task

import (
	"database/sql"
	"tasktracker/api/jwt"

	"github.com/gofiber/fiber/v2"
)

type TaskStruct struct {
	TaskDes string `json:"task_des"`
	Date    int64  `json:"date"`
	Hard    string `json:"hard"`
	Status  string `json:"status"`
}

func AddTask(c *fiber.Ctx, db *sql.DB) error {
	var newTask TaskStruct
	sessionToken := c.Params("session_token")

	userID, err := jwt.CheckJWT(sessionToken)
	if err != nil {
		return c.Status(fiber.StatusUnauthorized).JSON(fiber.Map{
			"message": "Failed to get user ID",
		})
	}

	if err := c.BodyParser(&newTask); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"message": "Invalid input",
		})
	}

	query := `INSERT INTO tasks (user_id, task_des, date, hard, status) VALUES ($1, $2, $3, $4, $5)`
	_, err = db.Exec(query, userID, newTask.TaskDes, newTask.Date, newTask.Hard, newTask.Status)

	if err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"message": "Failed add new task",
		})
	}

	return c.Status(fiber.StatusAccepted).JSON(fiber.Map{
		"message": "Task has been added",
	})
}
