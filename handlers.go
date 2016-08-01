package main

import (
	"encoding/json"
	"log"
	"net/http"
)

func showAPI(w http.ResponseWriter, req *http.Request) {
	api := []string{
		"no api calls are implemented for now :)",
	}

	writeJSON(api, w, http.StatusOK)
}

// writeJSON marshals data into JSON then outputs it on the response writer
// with appropriate status code.
func writeJSON(data interface{}, w http.ResponseWriter, statusCode int) {
	payload, err := json.Marshal(data)
	if err != nil {
		log.Println("Failed to json.Marshal", data, err)
		w.WriteHeader(http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json; encoding=\"utf-8\"")
	w.WriteHeader(statusCode)
	w.Write(payload)
}
