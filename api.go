package main

import "time"

// APIProject is the view of a project as exposed through the API.
type APIProject struct {
	ID          uint
	Name        string
	Description string
	startedAt   *time.Time
	dueAt       *time.Time // deadline as set in the deal
	finishedAt  *time.Time // real end date
	MoodsByWeek map[uint]APIMood
}

// APIMood is the view of a mood as exposed through the API.
type APIMood struct {
	Customer string // is the customer happy?
	Team     string // is the team happy?
	Money    string // is the project worth it?
	Details  string // side notes
}
