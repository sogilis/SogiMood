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

func doTransaction(c redis.Conn, pipeline func(c redis.Conn)) (interface{}, error) {
	c.Send("MULTI")
	pipeline(c)
	return c.Do("EXEC")
}

func writeProject(id string, project ProjectDB, moodsByWeek map[string]MoodDB, conn redis.Conn) error {
	_, err := doTransaction(conn, func(c redis.Conn) {
		c.Send("HMSET", keyForProject(id),
			"name", project.Name,
			"description", project.Description,
			"started_at", project.StartedAt,
			"due_at", project.DueAt,
			"finished_at", project.FinishedAt)

		for week, mood := range moodsByWeek {
			c.Send("HMSET", keyForMood(id, week),
				"customer", mood.Customer,
				"team", mood.Team,
				"money", mood.Money,
				"details", mood.Details)
		}
	})

	return err
}

func writeMood(id, week string, mood MoodDB, conn redis.Conn) error {
	_, err := conn.Do("HMSET", keyForMood(id, week),
		"customer", mood.Customer,
		"team", mood.Team,
		"money", mood.Money,
		"details", mood.Details)

	return err
}
