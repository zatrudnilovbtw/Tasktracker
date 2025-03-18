package notes

import (
	"database/sql"
	"log"
	"tasktracker/api/jwt"

	"github.com/gofiber/fiber/v2"
)

type Notes struct {
	ID string `json:"id"`
	NotesStruct
}

func GetNotes(c *fiber.Ctx, db *sql.DB) error {
	sessionToken := c.Params("session_token")

	userID, err := jwt.CheckJWT(sessionToken)
	if err != nil {
		return c.Status(fiber.StatusUnauthorized).JSON(fiber.Map{
			"message": "Failed to get user ID",
		})
	}

	query := `SELECT * FROM notes WHERE user_id = $1`
	rows, err := db.Query(query, userID)
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"message": "Failed to get notes",
		})
	}

	var notes []Notes
	for rows.Next() {
		var note Notes
		if err := rows.Scan(&note.ID, &userID, &note.Text); err != nil {
			log.Printf("Failed to scan note: %v", err)
			return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
				"message": "Failed to process notes",
			})
		}
		notes = append(notes, note)
	}

	if err := rows.Err(); err != nil {
		log.Printf("Error during rows iteration: %v", err)
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"message": "Failed to process notes",
		})
	}

	return c.Status(fiber.StatusOK).JSON(fiber.Map{
		"notes": notes,
	})
}
