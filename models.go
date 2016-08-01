package main

import "time"

// Project is the base model for the backend.
type Project struct {
	ID          uint `gorm:"primary_key;AUTO_INCREMENT"`
	CreatedAt   time.Time
	UpdatedAt   time.Time
	DeletedAt   *time.Time // this is gorm internal to have soft delete
	Name        string
	Description string
	startedAt   *time.Time
	dueAt       *time.Time // deadline as set in the deal
	finishedAt  *time.Time // real end date
	Moods       []Mood
}

// MoodType represents an enum in the sogimood database.
type MoodType string

// Various values the MoodType enum can take.
const (
	Unknown MoodType = "unknown"
	Happy   MoodType = "happy"
	Soso    MoodType = "so-so"
	Sad     MoodType = "sad"
	Wtf     MoodType = "wtf"
)

// Mood describes how happy people at Sogilis are about the project.
type Mood struct {
	ID         uint     `gorm:"primary_key;AUTO_INCREMENT"`
	ProjectID  uint     // foreign key to projects.
	WeekNumber uint     // should be somewhere between 1 to 51
	Customer   MoodType `sql:"not null;type:ENUM('unknown', 'happy', 'so-so', 'sad', 'wtf')"` // is the customer happy?
	Team       MoodType `sql:"not null;type:ENUM('unknown', 'happy', 'so-so', 'sad', 'wtf')"` // is the team happy?
	Money      MoodType `sql:"not null;type:ENUM('unknown', 'happy', 'so-so', 'sad', 'wtf')"` // is the project worth it?
	Details    string   // side notes
}
