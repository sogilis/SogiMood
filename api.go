package main

import "time"

// Various values describing mood types.
const (
	Unknown string = "unknown"
	Happy   string = "happy"
	Soso    string = "so-so"
	Sad     string = "sad"
	Wtf     string = "wtf"
)

// Project is the view of a project as exposed through the API.
type Project struct {
	ID          uint
	Name        string
	Description string
	startedAt   *time.Time    // start date
	dueAt       *time.Time    // deadline as set in the deal
	finishedAt  *time.Time    // real end date
	MoodsByWeek map[uint]Mood // moods by week number
}

// Mood is the view of a mood as exposed through the API.
type Mood struct {
	Customer string // is the customer happy?
	Team     string // is the team happy?
	Money    string // is the project worth it?
	Details  string // side notes
}
