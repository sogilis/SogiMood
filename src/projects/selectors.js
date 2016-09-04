import { sortByEndDate, filterNonArchived, filterArchived } from './model'

export function listProjects(state) {
  return Object.keys(state.projects).map(id => state.projects[id])
}

export function getArchived(state) {
  return sortByEndDate(filterArchived(listProjects(state)))
}

export function getNonArchived(state) {
  return sortByEndDate(filterNonArchived(listProjects(state)))
}
