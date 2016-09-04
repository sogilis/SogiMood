import moment from 'moment'

const defaultValues = {
  name: 'Nouveau projet',
  description: '',
  startedAt: 0,
  dueAt: 0,
  finishedAt: 0,
  moodsByWeek: {},
  archived: false,
}

export function build(data = {}) {
  return {
    ...defaultValues,
    ...data,
  }
}

export function sortByEndDate(projects) {
  return projects.sort((project1, project2) => {
    if (!project1.dueAt && !project1.finishedAt) {
      return 1
    }
    if (!project2.dueAt && !project2.finishedAt) {
      return -1
    }

    const project1EndedOn = moment(project1.finishedAt || project1.dueAt)
    const project2EndedOn = moment(project2.finishedAt || project2.dueAt)

    if (project1EndedOn.isSame(project2EndedOn)) {
      return 0
    } else if (project1EndedOn.isBefore(project2EndedOn)) {
      return -1
    }
    return 1
  })
}

export function filterNonArchived(projects) {
  return projects.filter(project => !project.archived)
}

export function filterArchived(projects) {
  return projects.filter(project => project.archived)
}
