package notes

import (
	"database/sql"

	"github.com/gofiber/fiber/v2"
)

func DeleteNotes(c *fiber.Ctx, db *sql.DB) error {
	id := c.Params("id")

	query := "DELETE FROM notes WHERE id = $1"
	_, err := db.Exec(query, id)

	if err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"message": "Failed delete notes",
		})
	}

	return c.Status(fiber.StatusAccepted).JSON(fiber.Map{
		"message": "notes has been deleted",
	})
}
