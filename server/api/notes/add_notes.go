package notes

import (
	"database/sql"
	"tasktracker/api/jwt"

	"github.com/gofiber/fiber/v2"
)

type NotesStruct struct {
	Text string `json:"text"`
}

func AddNotes(c *fiber.Ctx, db *sql.DB) error {
	var newNote NotesStruct
	sessionToken := c.Params("session_token")

	userID, err := jwt.CheckJWT(sessionToken)
	if err != nil {
		return c.Status(fiber.StatusUnauthorized).JSON(fiber.Map{
			"message": "Failed to get user ID",
		})
	}

	if err := c.BodyParser(&newNote); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"message": "Invalid input",
		})
	}

	query := `INSERT INTO notes (user_id, text) VALUES ($1, $2)`
	_, err = db.Exec(query, userID, newNote.Text)

	if err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"message": "Failed add notes",
		})
	}

	return c.Status(fiber.StatusAccepted).JSON(fiber.Map{
		"message": "Notes has been added",
	})
}
