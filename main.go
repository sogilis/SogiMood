package main

import (
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
	router.HandleFunc("/projects", listProjects).Methods("GET")
	router.HandleFunc("/project", removeProject).Methods("DELETE").Queries("id", "{id}")
	router.HandleFunc("/project", newProject).Methods("POST").Headers("Content-Type", "application/json")
	router.HandleFunc("/mood", setMood).Methods("POST").Headers("Content-Type", "application/json").Queries("id", "{id}", "weekNo", "{weekNo:[0-9]+}")
	return router
}

func main() {
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

	pool = newPool(redisURL)

	srv := http.Server{
		Addr:    ":" + port,
		Handler: appHandler(),
	}

	log.Printf("sogimood-backend is running on port " + port + " bro' :)")
	if err := srv.ListenAndServe(); err != nil {
		log.Fatal(err)
	}
}
