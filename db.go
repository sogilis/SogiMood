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

// MoodsByWeekDB is a map of MoodDB indexed by week number.
type MoodsByWeekDB map[string]MoodDB

func keyForProjects() string {
	return "projects"
}

func keyForProject(id string) string {
	return fmt.Sprintf("project:%s", id)
}

func keyForMoods(id string) string {
	return fmt.Sprintf("moods:%s", id)
}

func keyForMood(id, weekNo string) string {
	return fmt.Sprintf("mood:%s:week:%s", id, weekNo)
}

func doTransaction(c redis.Conn, pipeline func(c redis.Conn)) (interface{}, error) {
	c.Send("MULTI")
	pipeline(c)
	return c.Do("EXEC")
}

func writeProject(id string, project ProjectDB, moodsByWeek MoodsByWeekDB, conn redis.Conn) error {
	_, err := doTransaction(conn, func(c redis.Conn) {
		c.Send("HMSET", keyForProject(id),
			"name", project.Name,
			"description", project.Description,
			"started_at", project.StartedAt,
			"due_at", project.DueAt,
			"finished_at", project.FinishedAt)

		for week, mood := range moodsByWeek {
			writeMoodPipelined(id, week, mood, c)
		}

		c.Send("SADD", keyForProjects(), id)
	})

	return err
}

func writeMood(id, week string, mood MoodDB, conn redis.Conn) error {
	_, err := doTransaction(conn, func(c redis.Conn) {
		writeMoodPipelined(id, week, mood, c)
	})

	return err
}

func writeMoodPipelined(id, week string, mood MoodDB, conn redis.Conn) {
	conn.Send("HMSET", keyForMood(id, week),
		"customer", mood.Customer,
		"team", mood.Team,
		"money", mood.Money,
		"details", mood.Details)

	conn.Send("SADD", keyForMoods(id), week)
}

func readIDs(idsKey string, conn redis.Conn) ([]string, error) {
	values, err := redis.Values(conn.Do("SMEMBERS", idsKey))
	if err != nil {
		return []string{}, err
	}

	var res []string
	for len(values) > 0 {
		var str string
		values, err = redis.Scan(values, &str)
		if err != nil {
			return []string{}, err
		}
		res = append(res, str)
	}

	return res, nil
}

func readProject(id string, conn redis.Conn) (ProjectDB, MoodsByWeekDB, error) {
	weeks, err := readIDs(keyForMoods(id), conn)
	if err != nil {
		return ProjectDB{}, MoodsByWeekDB{}, err
	}

	replies, err := redis.Values(doTransaction(conn, func(c redis.Conn) {
		c.Send("HGETALL", keyForProject(id))
		for _, week := range weeks {
			c.Send("HGETALL", keyForMood(id, week))
		}
	}))
	if err != nil {
		return ProjectDB{}, MoodsByWeekDB{}, err
	}

	var project ProjectDB
	err = redis.ScanStruct(assertIsArray(replies[0]), &project)
	if err != nil {
		return ProjectDB{}, MoodsByWeekDB{}, err
	}

	moodsByWeek := MoodsByWeekDB{}
	for i, week := range weeks {
		var mood MoodDB
		err = redis.ScanStruct(assertIsArray(replies[i+1]), &mood)
		if err != nil {
			return ProjectDB{}, MoodsByWeekDB{}, err
		}

		moodsByWeek[week] = mood
	}

	return project, moodsByWeek, nil
}

func readProjects(conn redis.Conn) ([]string, []ProjectDB, []MoodsByWeekDB, error) {
	ids, err := readIDs(keyForProjects(), conn)
	if err != nil {
		return []string{}, []ProjectDB{}, []MoodsByWeekDB{}, err
	}

	var projects []ProjectDB
	var moods []MoodsByWeekDB
	for _, id := range ids {
		project, moodsByWeek, err := readProject(id, conn)
		if err != nil {
			return []string{}, []ProjectDB{}, []MoodsByWeekDB{}, err
		}

		projects = append(projects, project)
		moods = append(moods, moodsByWeek)
	}

	return ids, projects, moods, nil
}

func assertIsArray(value interface{}) []interface{} {
	return value.([]interface{})
}
