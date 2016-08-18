package main

import (
	"log"
	"net/http"
	"os"
	"time"

	"github.com/garyburd/redigo/redis"
)

var (
	pool *redis.Pool
)

func newPool(redisURL string) *redis.Pool {
	return &redis.Pool{
		MaxIdle:     3,
		IdleTimeout: 240 * time.Second,
		Dial: func() (redis.Conn, error) {
			return redis.DialURL(redisURL)
		},
		TestOnBorrow: func(c redis.Conn, t time.Time) error {
			_, err := c.Do("PING")
			return err
		},
	}
}

func parseEnvironment() (string, string, string) {
	redisURL := os.Getenv("REDIS_URL")
	if redisURL == "" {
		redisURL = "redis://:@127.0.0.1:6379"
		log.Println("environment variable REDIS_URL is not set, defaults to " + redisURL)
	}

	port := os.Getenv("PORT")
	if port == "" {
		port = "8081"
		log.Println("environment variable PORT is not set, defaults to " + port)
	}

	authenticationToken := os.Getenv("ACCESS_TOKEN")
	if authenticationToken == "" {
		log.Println("ACCESS_TOKEN environment variable is not set, defaults to empty token")
	}

	return redisURL, port, authenticationToken
}

func main() {
	redisURL, port, authToken := parseEnvironment()
	pool = newPool(redisURL)

	srv := http.Server{
		Addr:    ":" + port,
		Handler: appHandler(authToken),
	}

	log.Printf("sogimood-backend is running on port " + port + " bro' :)")
	if err := srv.ListenAndServe(); err != nil {
		log.Fatal(err)
	}
}
