package api

import (
	"database/sql"
	"fmt"
	"log"
	"tasktracker/config"
)

func ConnectDB() *sql.DB {
	log.Print("Start connect to database")

	cfg := config.LoadConfig()
	connStr := fmt.Sprintf("postgres://%v:%v@%v:%v/%v?sslmode=%v&search_path=%v", cfg.DBUser, cfg.DBPassword, cfg.DBHost, cfg.DBPort, cfg.DBName, cfg.DBSsl, cfg.DBPath)
	
	db, err := sql.Open("postgres", connStr)
	if err != nil {
		log.Fatalf("%s: %v", "Opening the database failed", err)
	} else {
		log.Println("The database has opened successfully")
	}

	return db
}
