package main

import (
	"fmt"
	"log"
	"net/http"

	"github.com/gorilla/mux"
)

func appHandler() *mux.Router {
	router := mux.NewRouter()
	router.HandleFunc("/", showAPI)
	return router
}

func main() {
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
