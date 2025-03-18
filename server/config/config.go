package config

type Config struct {
	DBHost     string
	DBPort     int
	DBUser     string
	DBPassword string
	DBName     string
	DBSsl      string
	DBPath     string

	MAILFrom        string
	MAILPasswordApp string
	MAILSmtpHost    string
	MAILSmtpPort    int

	JWTSecret string
}

func LoadConfig() *Config {
	return &Config{
		DBHost:     "localhost",
		DBPort:     5432,
		DBUser:     "postgres",
		DBPassword: "",
		DBName:     "postgres",
		DBSsl:      "disable",
		DBPath:     "track_it",

		MAILFrom:        "",
		MAILPasswordApp: "",
		MAILSmtpHost:    "smtp.gmail.com",
		MAILSmtpPort:    587,

		JWTSecret: "qweasdzxc",
	}
}
