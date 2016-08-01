package main

import (
	"fmt"
	"log"
	"net/http"
	"strings"

	"github.com/gorilla/mux"
	"github.com/jinzhu/gorm"
	_ "github.com/jinzhu/gorm/dialects/postgres"
)

var db *gorm.DB

func appHandler() *mux.Router {
	router := mux.NewRouter()
	router.HandleFunc("/", showAPI)
	return router
}

func connectDB() (*gorm.DB, error) {
	conn := strings.Join([]string{
		"host=localhost",
		"user=sogilis",
		"dbname=sogimood-db",
		"password=D8ZZKEVR2UdghW",
		"sslmode=disable",
	}, " ")

	return gorm.Open("postgres", conn)
}

func main() {
	_, err := connectDB()
	if err != nil {
		log.Fatal(err)
	}

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
