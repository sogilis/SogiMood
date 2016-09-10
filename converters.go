package main

import (
	"log"

	"github.com/nu7hatch/gouuid"
)

func toProjectDB(p Project) (ProjectDB, map[string]MoodDB) {
	projectDB := ProjectDB{
		Name:        p.Name,
		Description: p.Description,
		StartedAt:   p.StartedAt,
		DueAt:       p.DueAt,
		FinishedAt:  p.FinishedAt,
	}

	moodsByWeek := map[string]MoodDB{}
	for week, mood := range p.MoodsByWeek {
		moodsByWeek[week] = toMoodDB(mood)
	}

	return projectDB, moodsByWeek
}

func toMoodDB(m Mood) MoodDB {
	return MoodDB{
		Customer: m.Customer,
		Team:     m.Team,
		Money:    m.Money,
		Details:  m.Details,
		Marker:   m.Marker,
	}
}

func toProject(id string, p ProjectDB, mbw map[string]MoodDB) Project {
	project := Project{
		ID:          id,
		Name:        p.Name,
		Description: p.Description,
		StartedAt:   p.StartedAt,
		DueAt:       p.DueAt,
		FinishedAt:  p.FinishedAt,
		MoodsByWeek: map[string]Mood{},
	}

	for week, mood := range mbw {
		project.MoodsByWeek[week] = toMood(mood)
	}

	return project
}

func toMood(m MoodDB) Mood {
	return Mood{
		Customer: m.Customer,
		Team:     m.Team,
		Money:    m.Money,
		Details:  m.Details,
		Marker:   m.Marker,
	}
}

func idOrNewUUID(id string) (string, error) {
	if id != "" {
		log.Println("id is set to " + id)
		return id, nil
	}

	guid, err := uuid.NewV4()
	if err != nil {
		return "", err
	}

	log.Println("new id " + guid.String() + " has been created")
	return guid.String(), nil
}
