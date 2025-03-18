package jwt

import (
	"fmt"
	"tasktracker/config"
	"time"

	"github.com/golang-jwt/jwt/v5"
)

var (
	cfg       = config.LoadConfig()
	secretKey = []byte(cfg.JWTSecret)
)

type CustomClaims struct {
	ID int `json:"id"`
	jwt.RegisteredClaims
}

func CreateJWT(userData int) string {
	claims := CustomClaims{
		ID: userData,
		RegisteredClaims: jwt.RegisteredClaims{
			ExpiresAt: jwt.NewNumericDate(time.Now().Add(24 * time.Hour)),
			IssuedAt:  jwt.NewNumericDate(time.Now()),
			Issuer:    "track-it",
		},
	}

	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
	tokenString, err := token.SignedString(secretKey)
	if err != nil {
		fmt.Print(err)
	}

	return tokenString
}

func CheckJWT(tokenString string) (int, error) {
	token, err := jwt.ParseWithClaims(tokenString, &CustomClaims{}, func(token *jwt.Token) (interface{}, error) {
		return secretKey, nil
	})

	if err != nil {
		return 0, fmt.Errorf("token is invalid: %w", err)
	}

	claims, ok := token.Claims.(*CustomClaims)

	if !(ok && token.Valid) {
		return 0, fmt.Errorf("token is not valid")
	}

	return claims.ID, nil
}