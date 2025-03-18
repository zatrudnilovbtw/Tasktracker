package user

import (
	"database/sql"
	"tasktracker/api/jwt"

	"github.com/gofiber/fiber/v2"
)

type Users struct {
	ID      int    `json:"id"`
	Name    string `json:"name"`
	Surname string `json:"surname"`
	Email   string `json:"email"`
}

func GetUser(c *fiber.Ctx, database *sql.DB) error {
	var userData Users
	session_token := c.Params("session_token")

	userId, err := jwt.CheckJWT(session_token)

	if err != nil {
		return c.Status(fiber.StatusConflict).JSON(fiber.Map{
			"message": err.Error(),
		})
	}

	query := `SELECT id, name, surname, email FROM users WHERE id = $1`
	err = database.QueryRow(query, userId).Scan(
		&userData.ID,
		&userData.Name,
		&userData.Surname,
		&userData.Email,
	)

	if err == sql.ErrNoRows {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"message": "Get data user is failed",
		})
	}

	return c.Status(fiber.StatusAccepted).JSON(fiber.Map{
		"dataUser": userData,
	})
}
