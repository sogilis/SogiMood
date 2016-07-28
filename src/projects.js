function project(state = {}, action) {
  switch(action.type) {
  case 'CHANGE_NAME': {
    return {
      ...state,
      name: action.payload.name,
    }
  }
  case 'ADD_MOOD': {
    const { mood } = action.payload
    return {
      ...state,
      moods: [
        ...state.moods,
        { value: mood },
      ]
    }
  }
  case 'CHANGE_MOOD': {
    const { index, mood } = action.payload
    let nextState = {
      ...state,
      moods: [ ...state.moods ],
    }
    nextState.moods[index] = {
      ...nextState.moods[index],
      value: mood
    }
    return nextState
  }
  case 'SET_MOOD_NOTE': {
    const { index, note } = action.payload
    let nextState = {
      ...state,
      moods: [ ...state.moods ],
    }
    nextState.moods[index] = {
      ...nextState.moods[index],
      note: note,
    }
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
      moods: [],
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
  case 'CHANGE_NAME':
  case 'ADD_MOOD':
  case 'CHANGE_MOOD':
  case 'SET_MOOD_NOTE':
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

export function changeName(project, name) {
  return {
    type: 'CHANGE_NAME',
    payload: {
      project,
      name,
    }
  }
}

export function addMood(project, mood) {
  return {
    type: 'ADD_MOOD',
    payload: {
      project,
      mood
    }
  }
}

export function changeMood(project, index, mood) {
  return {
    type: 'CHANGE_MOOD',
    payload: {
      project,
      index,
      mood,
    }
  }
}

export function setMoodNote(project, index, note) {
  return {
    type: 'SET_MOOD_NOTE',
    payload: {
      project,
      index,
      note,
    }
  }
}

export function listProjects(state) {
  return Object.keys(state.projects).map(id => state.projects[id])
}
