package main

import "fmt"

func keyForProject(projectID string) string {
	return fmt.Sprintf("project:%s", projectID)
}

func keyForMood(projectID, weekNo string) string {
	return fmt.Sprintf("project:%s:week:%s", projectID, weekNo)
}
