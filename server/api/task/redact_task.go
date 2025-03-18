package task

import (
	"database/sql"
	"fmt"

	"github.com/gofiber/fiber/v2"
)

type Readct struct {
	Id    int    `json:"id"`
	Label string `json:"label"`
	Data  any    `json:"data"`
}

func RedactTask(c *fiber.Ctx, db *sql.DB) error {
	var newData Readct

	if err := c.BodyParser(&newData); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"message": "Invalid input",
		})
	}

	query := fmt.Sprintf("UPDATE tasks SET %v = $1 WHERE id = $2", newData.Label)
	_, err := db.Exec(query, newData.Data, newData.Id)
	if err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"message": "Failed update task",
		})
	}

	return c.Status(fiber.StatusAccepted).JSON(fiber.Map{
		"message": "Task has been redacted",
	})
}
