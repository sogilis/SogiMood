package main

import "fmt"

func keyForProject(projectID string) string {
	return fmt.Sprintf("project:%s", projectID)
}

func keyForMood(projectID string, weekNo int) string {
	return fmt.Sprintf("project:%s:week:%d", projectID, weekNo)
}
