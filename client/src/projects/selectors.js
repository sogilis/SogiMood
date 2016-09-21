import { sortByEndDate, filterNonArchived, filterArchived } from './model'

import snapmoods from '../snapmoods'

export function listProjectsOnPeriod(state, period) {
  const projects = Object.keys(state.projects.byIds).map(id => {
    const project = state.projects.byIds[id]
    // eslint-disable-next-line
    const { moodsByWeek, ...otherAttributes } = project
    return {
      ...otherAttributes,
      period: snapmoods.selectors.getProjectPeriod(state, project, period),
    }
  })
  return sortByEndDate(projects)
}

export function getArchivedOnPeriod(state, period) {
  return filterArchived(listProjectsOnPeriod(state, period))
}

export function getNonArchivedOnPeriod(state, period) {
  return filterNonArchived(listProjectsOnPeriod(state, period))
}

export function isFetching(state) {
  return state.projects.ajax['isFetching'] || false
}

export function isCreating(state) {
  return state.projects.ajax['isCreating'] || false
}

export function isUpdating(state, project) {
  return state.projects.ajax['isUpdating'] === project.id
}

export function isDeleting(state, project) {
  return state.projects.ajax['isDeleting'] === project.id
}

export function isMoodUpdating(state, project, weekNumber) {
  return state.projects.ajax['isMoodUpdating'] === `${ project.id }#${ weekNumber }`
}
