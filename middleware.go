package main

import (
	"strings"

	"net/http"

	"github.com/gorilla/mux"
)

func appHandler(authenticationToken string) http.Handler {
	router := mux.NewRouter()

	api := router.PathPrefix("/api").Subrouter()
	api.HandleFunc("/projects", listProjects).Methods("GET")
	api.HandleFunc("/project", removeProject).Methods("DELETE").Queries("id", "{id}")
	api.HandleFunc("/project", newProject).Methods("POST").Headers("Content-Type", "application/json")
	api.HandleFunc("/mood", setMood).Methods("POST").Headers("Content-Type", "application/json").Queries("id", "{id}", "weekNo", "{weekNo:[0-9]+}")

	router.PathPrefix("/static").Handler(http.FileServer(http.Dir("./dist")))
	router.PathPrefix("/").HandlerFunc(indexHandler("./dist/index.html"))

	return &AuthMiddleware{
		handler:   &CORSMiddleware{router},
		authToken: authenticationToken,
	}
}

func indexHandler(entrypoint string) func(w http.ResponseWriter, r *http.Request) {
	fn := func(w http.ResponseWriter, r *http.Request) {
		http.ServeFile(w, r, entrypoint)
	}

	return fn
}

// CORSMiddleware is a http.Handler wrapper that enables CORS.
type CORSMiddleware struct {
	handler http.Handler
}

func (cm *CORSMiddleware) ServeHTTP(w http.ResponseWriter, req *http.Request) {
	if origin := req.Header.Get("Origin"); origin != "" {
		w.Header().Set("Access-Control-Allow-Origin", origin)
		w.Header().Set("Access-Control-Allow-Methods", "POST, GET, OPTIONS, PUT, DELETE")
		w.Header().Set("Access-Control-Allow-Headers", "Accept, Access-Token, Content-Type, Content-Length, Accept-Encoding, X-CSRF-Token, Authorization")
	}

	if req.Method == "OPTIONS" {
		// Stop here if its Preflighted OPTIONS request
		return
	}

	cm.handler.ServeHTTP(w, req)
}

// AuthMiddleware is a http.Handler wrapper that enables basic by-token authentication.
type AuthMiddleware struct {
	handler   http.Handler
	authToken string
}

func (am *AuthMiddleware) ServeHTTP(w http.ResponseWriter, req *http.Request) {
	token := req.Header.Get("Access-Token")
	if strings.HasPrefix(req.URL.Path, "/api") && req.Method != "OPTIONS" && token != am.authToken {
		w.WriteHeader(http.StatusUnauthorized)
		return
	}

	am.handler.ServeHTTP(w, req)
}
