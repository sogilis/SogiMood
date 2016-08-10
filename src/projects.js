import moment from 'moment';

const ENDPOINT = 'https://sogimood-backend.herokuapp.com'

function project(state = {}, action) {
  switch(action.type) {
  case 'UPDATE_PROJECT': {
    return action.payload.project
  }
  case 'UPDATE_MOOD': {
    const { weekNumber, data } = action.payload
    let nextState = {
      ...state,
      moodsByWeek: { ...state.moodsByWeek },
    }
    nextState.moodsByWeek[weekNumber] = data
    return nextState
  }
  default:
    return state
  }
}

export default function projects(state = {}, action) {
  switch(action.type) {
  case 'SETUP_PROJECTS': {
    let projectsByIds = {}
    action.payload.projects.forEach(project => {
      projectsByIds[project.id] = project
    })
    return {
      ...state,
      projects: projectsByIds,
    }
  }
  case 'ADD_PROJECT': {
    const { project } = action.payload
    return {
      ...state,
      projects: {
        ...state.projects,
        [project.id]: project,
      },
    }
  }
  case 'DELETE_PROJECT': {
    let nextState = {
      ...state,
      projects: { ...state.projects },
    }
    delete nextState.projects[action.payload.project.id]
    return nextState
  }
  case 'UPDATE_PROJECT':
  case 'UPDATE_MOOD':
    const projectId = action.payload.project.id
    let nextState = {
      ...state,
      projects: { ...state.projects },
    }
    nextState.projects[projectId] = project(state.projects[projectId], action)
    return nextState
  default:
    return state
  }
}

export function setupProjects(projects) {
  return {
    type: 'SETUP_PROJECTS',
    payload: {
      projects,
    },
  }
}

export function addProject(project) {
  return {
    type: 'ADD_PROJECT',
    payload: {
      project,
    }
  }
}

export function deleteProject(project) {
  return {
    type: 'DELETE_PROJECT',
    payload: {
      project,
    },
  }
}

export function updateProject(project) {
  return {
    type: 'UPDATE_PROJECT',
    payload: {
      project,
    }
  }
}

export function updateMood(project, weekNumber, data) {
  return {
    type: 'UPDATE_MOOD',
    payload: {
      project,
      weekNumber,
      data,
    }
  }
}

function init(token, method = 'GET', body = {}) {
  let myInit = {
    method,
    headers: {
      'Content-Type': 'application/json',
      'Access-Token': token,
    },
  }

  if (method !== 'GET' && method !== 'HEAD') {
    myInit.body = JSON.stringify(body)
  }

  return myInit
}

export function requestProjects(token) {
  return fetch(`${ ENDPOINT }/projects`, init(token))
    .then(response => response.json())
    .catch(ex => console.log(ex))
}

export function requestCreateProject(token) {
  const body = {
    name: 'Nouveau projet',
    description: '',
    startedAt: 0,
    dueAt: 0,
    finishedAt: 0,
    moodsByWeek: {},
  }

  return fetch(`${ ENDPOINT }/project`, init(token, 'POST', body))
    .then(response => response.json())
    .catch(ex => console.log(ex))
}

export function requestUpdateProject(project, data, token) {
  const body = {
    ...project,
    ...data,
  }

  return fetch(`${ ENDPOINT }/project`, init(token, 'POST', body))
    .then(response => response.json())
    .catch(ex => console.log(ex))
}

export function requestDeleteProject(project, token) {
  return fetch(`${ ENDPOINT }/project?id=${ project.id }`, init(token, 'DELETE'))
    .catch(ex => console.log(ex))
}

export function requestUpdateMood(project, weekNumber, data, token) {
  return fetch(`${ ENDPOINT }/mood?id=${ project.id }&weekNo=${ weekNumber }`, init(token, 'POST', data))
    .catch(ex => console.log(ex))
}

export function listProjects(state) {
  return Object.keys(state.projects).map(id => state.projects[id])
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

export function keepNonArchivedProjects(projects) {
  return projects.filter(project => !project.archived)
}

export function keepArchivedProjects(projects) {
  return projects.filter(project => project.archived)
}
