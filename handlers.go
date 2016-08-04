package main

import (
	"encoding/json"
	"io/ioutil"
	"log"
	"net/http"

	"github.com/gorilla/mux"
)

func iAmRoot(w http.ResponseWriter, req *http.Request) {
	json := map[string]interface{}{
		"version": "0.1",
	}

	writeJSON(json, w, http.StatusOK)
}

func setMood(w http.ResponseWriter, req *http.Request) {
	vars := mux.Vars(req)
	key := keyForMood(vars["id"], vars["weekNo"])

	body, err := ioutil.ReadAll(req.Body)
	if err != nil {
		writeError(err, w)
		return
	}

	var mood Mood
	err = json.Unmarshal(body, &mood)
	if err != nil {
		writeError(err, w)
		return
	}

	conn := pool.Get()
	defer conn.Close()

	n, err := conn.Do("HMSET", key,
		"customer", mood.Customer,
		"team", mood.Team,
		"money", mood.Money,
		"details", mood.Details)

	if err != nil {
		writeError(err, w)
	}

	data := map[string]interface{}{
		"result": n,
	}

	writeJSON(data, w, http.StatusOK)
}

func writeError(err error, w http.ResponseWriter) {
	w.WriteHeader(http.StatusInternalServerError)
	w.Write([]byte(err.Error()))
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

	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(statusCode)
	w.Write(payload)
}
