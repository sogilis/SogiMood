import { sortByEndDate, filterNonArchived, filterArchived } from './model'

export function listProjects(state) {
  return Object.keys(state.projects.byIds).map(id => state.projects.byIds[id])
}

export function getArchived(state) {
  return sortByEndDate(filterArchived(listProjects(state)))
}

export function getNonArchived(state) {
  return sortByEndDate(filterNonArchived(listProjects(state)))
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
