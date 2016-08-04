package main

import (
	"fmt"

	"github.com/garyburd/redigo/redis"
)

// ProjectDB is the model for a project.
type ProjectDB struct {
	Name        string `redis:"name"`
	Description string `redis:"description"`
	StartedAt   int64  `redis:"started_at"`
	DueAt       int64  `redis:"due_at"`
	FinishedAt  int64  `redis:"finished_at"`
}

// MoodDB is the model for a mood.
type MoodDB struct {
	Customer string `redis:"customer"`
	Team     string `redis:"team"`
	Money    string `redis:"money"`
	Details  string `redis:"details"`
}

func keyForProject(id string) string {
	return fmt.Sprintf("project:%s", id)
}

func keyForMood(id, weekNo string) string {
	return fmt.Sprintf("mood:project:%s:week:%s", id, weekNo)
}

func saveProject(p ProjectDB, key string, c redis.Conn) (interface{}, error) {
	return c.Do("HMSET", key,
		"name", p.Name,
		"description", p.Description,
		"started_at", p.StartedAt,
		"due_at", p.DueAt,
		"finished_at", p.FinishedAt)
}

func saveMood(m MoodDB, key string, c redis.Conn) (interface{}, error) {
	return c.Do("HMSET", key,
		"customer", m.Customer,
		"team", m.Team,
		"money", m.Money,
		"details", m.Details)
}
