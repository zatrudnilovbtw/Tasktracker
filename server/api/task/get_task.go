package task

import (
	"database/sql"
	"log"
	"tasktracker/api/jwt"

	"github.com/gofiber/fiber/v2"
)

type Task struct {
	ID string `json:"id"`
	TaskStruct
}

func GetTask(c *fiber.Ctx, db *sql.DB) error {
	sessionToken := c.Params("session_token")

	userID, err := jwt.CheckJWT(sessionToken)
	if err != nil {
		return c.Status(fiber.StatusUnauthorized).JSON(fiber.Map{
			"message": "Failed to get user ID",
		})
	}

	query := `SELECT * FROM tasks WHERE user_id = $1`
	rows, err := db.Query(query, userID)
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"message": "Failed to get tasks",
		})
	}

	var tasks []Task
	for rows.Next() {
		var task Task
		if err := rows.Scan(&task.ID, &task.TaskDes, &task.Hard, &task.Status, &task.Date); err != nil {
			log.Printf("Failed to scan task: %v", err)
			return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
				"message": "Failed to process tasks",
			})
		}
		tasks = append(tasks, task)
	}

	if err := rows.Err(); err != nil {
		log.Printf("Error during rows iteration: %v", err)
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"message": "Failed to process tasks",
		})
	}

	return c.Status(fiber.StatusOK).JSON(fiber.Map{
		"tasks": tasks,
	})
}
