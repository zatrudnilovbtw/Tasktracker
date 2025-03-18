package user

import (
	"database/sql"
	"fmt"
	"log"
	"math/rand"
	"tasktracker/config"
	"time"

	"github.com/gofiber/fiber/v2"
	"gopkg.in/gomail.v2"
)

type CreateEmailConfirmationStruct struct {
	Email string `json:"email"`
}

type EmailConfirmationStruct struct {
	Pin      int    `json:"pin"`
	Name     string `json:"name"`
	Surname  string `json:"surname"`
	Email    string `json:"email"`
	Password string `json:"password"`
}

func RandomPin(min, max int) int {
	return rand.Intn(max-min) + min
}

func SendMail(userEmail string, pin int) {
	cfg := config.LoadConfig()

	from := cfg.MAILFrom
	password_app := cfg.MAILPasswordApp
	smtpHost := cfg.MAILSmtpHost
	smtpPort := cfg.MAILSmtpPort

	mail := gomail.NewMessage()
	mail.SetHeader("From", from)
	mail.SetHeader("To", userEmail)
	mail.SetHeader("Subject", "PIN code")
	mail.SetBody("text/html", fmt.Sprintf("%d", pin))

	dialer := gomail.NewDialer(smtpHost, smtpPort, from, password_app)

	if err := dialer.DialAndSend(mail); err != nil {
		log.Println("Error send email:", err)
		return
	}
}

func CreateEmailConfirmation(c *fiber.Ctx, database *sql.DB) error {
	var dataCreateEmailConfirmation CreateEmailConfirmationStruct
	var dataUserID int
	var dataIdPin int
	time := time.Now()

	if err := c.BodyParser(&dataCreateEmailConfirmation); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"message": "Invalid input",
		})
	}

	querySelect := "SELECT id FROM users WHERE email = $1"
	err := database.QueryRow(querySelect, dataCreateEmailConfirmation.Email).Scan(&dataUserID)

	if err == nil {
		return c.Status(fiber.StatusFound).JSON(fiber.Map{
			"message": "User is found",
		})
	}

	queryCreateEmailConfirmation := `INSERT INTO email_confirmation(email, time, pin) VALUES ($1, $2, $3) RETURNING pin`
	err = database.QueryRow(queryCreateEmailConfirmation, dataCreateEmailConfirmation.Email, time.Unix(), RandomPin(1000, 9999)).Scan(&dataIdPin)

	if err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"message": "Add pin is failed",
			"error":   err.Error(),
		})
	}

	SendMail(dataCreateEmailConfirmation.Email, dataIdPin)

	return c.Status(fiber.StatusAccepted).JSON(fiber.Map{
		"message": "Pin is added",
	})
}

func EmailConfirmation(c *fiber.Ctx, database *sql.DB) error {
	var dataEmailConfirmation EmailConfirmationStruct
	var getPin int
	var deletePin int

	if err := c.BodyParser(&dataEmailConfirmation); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"message": "Invalid input",
		})
	}

	queryGetDataEmailConfirmation := "SELECT pin FROM email_confirmation WHERE email = $1 AND pin = $2"
	err := database.QueryRow(queryGetDataEmailConfirmation, dataEmailConfirmation.Email, dataEmailConfirmation.Pin).Scan(&getPin)

	if err != nil {
		return c.Status(fiber.StatusNotFound).JSON(fiber.Map{
			"message": "Pin is not found",
		})
	}

	err = Register(c, database, &dataEmailConfirmation)

	if err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"message": "Create user is failed",
		})
	}

	queryDeleteEmailConfirmation := "DELETE FROM email_confirmation WHERE email = $1"
	err = database.QueryRow(queryDeleteEmailConfirmation, dataEmailConfirmation.Email).Scan(&deletePin)

	if err == nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"message": "Delete pin is failed",
		})
	}

	return c.Status(fiber.StatusAccepted).JSON(fiber.Map{
		"message": "User create",
	})
}

func Register(c *fiber.Ctx, database *sql.DB, dataEmailConfirmation *EmailConfirmationStruct) error {
	var retId int

	queryCreateUser := "INSERT INTO users (name, surname, email, password) VALUES ($1, $2, $3, $4) RETURNING id"
	err := database.QueryRow(
		queryCreateUser,
		dataEmailConfirmation.Name,
		dataEmailConfirmation.Surname,
		dataEmailConfirmation.Email,
		dataEmailConfirmation.Password).Scan(&retId)

	if err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"message": "Create user is failed",
		})
	}

	log.Printf("A user with the ID was registered: '%d'\n", retId)

	return c.Status(fiber.StatusAccepted).JSON(fiber.Map{
		"message": "User is added",
	})
}
