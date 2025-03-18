package task

import (
	"database/sql"

	"github.com/gofiber/fiber/v2"
)

func DeleteTask(c *fiber.Ctx, db *sql.DB) error {
	id := c.Params("id")

	query := "DELETE FROM tasks WHERE id = $1"
	_, err := db.Exec(query, id)

	if err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"message": "Failed delete task",
		})
	}

	return c.Status(fiber.StatusAccepted).JSON(fiber.Map{
		"message": "Task has been deleted",
	})
}
