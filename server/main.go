package main

import (
	"tasktracker/api"
	"tasktracker/api/notes"
	"tasktracker/api/task"
	"tasktracker/api/user"

	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/fiber/v2/middleware/cors"
	_ "github.com/lib/pq"
)

func main() {
	db := api.ConnectDB()
	defer db.Close()

	app := fiber.New()
	app.Use(cors.New(cors.Config{
		AllowOrigins: "http://localhost:5173",
		AllowMethods: "GET, POST, PUT, DELETE",
	}))

	app.Post("/login", func(c *fiber.Ctx) error {
		return user.Login(c, db)
	})

	app.Put("/createEmailConfirmation", func(c *fiber.Ctx) error {
		return user.CreateEmailConfirmation(c, db)
	})

	app.Put("/createUser", func(c *fiber.Ctx) error {
		return user.EmailConfirmation(c, db)
	})

	app.Get("/getUser/:session_token", func(c *fiber.Ctx) error {
		return user.GetUser(c, db)
	})

	app.Get("/getTask/:session_token", func(c *fiber.Ctx) error {
		return task.GetTask(c, db)
	})

	app.Put("/addTask/:session_token", func(c *fiber.Ctx) error {
		return task.AddTask(c, db)
	})

	app.Put("/redactTask", func(c *fiber.Ctx) error {
		return task.RedactTask(c, db)
	})

	app.Delete("/deleteTask/:id", func(c *fiber.Ctx) error {
		return task.DeleteTask(c, db)
	})

	app.Get("/getNote/:session_token", func(c *fiber.Ctx) error {
		return notes.GetNotes(c, db)
	})

	app.Put("/addNote/:session_token", func(c *fiber.Ctx) error {
		return notes.AddNotes(c, db)
	})

	app.Put("/redactNote", func(c *fiber.Ctx) error {
		return notes.RedactNotes(c, db)
	})

	app.Delete("/deleteNote/:id", func(c *fiber.Ctx) error {
		return notes.DeleteNotes(c, db)
	})

	app.Listen("localhost:8080")
}
