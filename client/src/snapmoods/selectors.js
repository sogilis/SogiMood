import { getWeekLabel, getProjectStatus, getMoodStatus, isCurrentWeek } from './model'

export function getProjectPeriod(state, project, period) {
  let projectPeriod = []
  period.by('weeks', date => {
    const weekNumber = date.week()
    const projectMood = project.moodsByWeek[weekNumber]
    const mood = projectMood == null ? null : {
      ...projectMood,
      status: getMoodStatus(projectMood),
    }
    const week = {
      id: `${ project.id }-${ weekNumber }`,
      number: weekNumber,
      label: getWeekLabel(date),
      projectStatus: getProjectStatus(project, date),
      isCurrent: isCurrentWeek(date),
      mood,
    }
    projectPeriod.push(week)
  })
  return projectPeriod
}
