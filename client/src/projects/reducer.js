import * as t from './actionTypes'

function project(state = {}, action) {
  switch(action.type) {
  case t.UPDATE: {
    return action.payload.project
  }
  case t.UPDATE_MOOD: {
    const { weekNumber, data } = action.payload
    return {
      ...state,
      moodsByWeek: {
        ...state.moodsByWeek,
        [weekNumber]: data,
      },
    }
  }
  default:
    return state
  }
}

export default function projects(state = {}, action) {
  switch(action.type) {
  case t.SETUP: {
    let projectsByIds = {}
    action.payload.projects.forEach(project => {
      projectsByIds[project.id] = project
    })
    return projectsByIds
  }
  case t.ADD: {
    const { project } = action.payload
    return {
      ...state,
      [project.id]: project,
    }
  }
  case t.REMOVE: {
    let nextState = { ...state }
    delete nextState[action.payload.project.id]
    return nextState
  }
  case t.UPDATE:
  case t.UPDATE_MOOD:
    const projectId = action.payload.project.id
    return {
      ...state,
      [projectId]: project(state[projectId], action)
    }
  default:
    return state
  }
}
