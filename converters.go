package main

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
	}
}

func toProject(p ProjectDB, mbw map[string]MoodDB) Project {
	project := Project{
		Name:        p.Name,
		Description: p.Description,
		StartedAt:   p.StartedAt,
		DueAt:       p.DueAt,
		FinishedAt:  p.FinishedAt,
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
	}
}
