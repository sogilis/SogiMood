function project(state = {}, action) {
  switch(action.type) {
  case 'UPDATE_PROJECT': {
    return {
      ...state,
      ...action.payload.data,
    }
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
  case 'CREATE_PROJECT': {
    const newId = Object.keys(state.projects).length + 1
    let nextState = {
      ...state,
      projects: { ...state.projects },
    }
    nextState.projects[newId] = {
      id: newId,
      name: 'Nouveau projet',
      description: '',
      startedOn: '',
      initialEndedOn: '',
      estimatedEndedOn: '',
      moodsByWeek: {},
    }
    return nextState
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

export function createProject() {
  return {
    type: 'CREATE_PROJECT',
  }
}

export function deleteProject(project) {
  return {
    type: 'DELETE_PROJECT',
    payload: {
      project,
    }
  }
}

export function updateProject(project, data) {
  return {
    type: 'UPDATE_PROJECT',
    payload: {
      project,
      data,
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

export function listProjects(state) {
  return Object.keys(state.projects).map(id => state.projects[id])
}
