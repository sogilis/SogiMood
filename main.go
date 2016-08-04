package main

import (
	"fmt"
	"log"
	"net/http"
	"os"
	"time"

	"github.com/garyburd/redigo/redis"
	"github.com/gorilla/mux"
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

func appHandler() *mux.Router {
	router := mux.NewRouter()
	router.HandleFunc("/", iAmRoot)
	router.HandleFunc("/project", newProject).Methods("POST").Headers("Content-Type", "application/json")
	router.HandleFunc("/mood", setMood).Methods("POST").Headers("Content-Type", "application/json").Queries("id", "{id}", "weekNo", "{weekNo:[0-9]+}")
	return router
}

func main() {
	redisURL := os.Getenv("REDIS_URL")
	if redisURL == "" {
		log.Fatal("The environment variable REDIS_URL must be set")
	}

	pool = newPool(redisURL)

	port := 8081
	srv := http.Server{
		Addr:    fmt.Sprintf(":%d", port),
		Handler: appHandler(),
	}

	log.Printf("sogimood-backend running at 'http://localhost:%d'", port)
	if err := srv.ListenAndServe(); err != nil {
		log.Fatal(err)
	}
}
