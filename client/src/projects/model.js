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
    const project1EndedOn = project1.finishedAt || project1.dueAt
    const project2EndedOn = project2.finishedAt || project2.dueAt

    if (!project1EndedOn && !project2EndedOn) {
      return project1.name.localeCompare(project2.name)
    }
    if (!project1EndedOn) { return 1 }
    if (!project2EndedOn) { return -1 }

    const moment1 = moment(project1EndedOn)
    const moment2 = moment(project2EndedOn)

    if (moment1.isSame(moment2)) {
      return project1.name.localeCompare(project2.name)
    } else if (moment1.isBefore(moment2)) {
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
