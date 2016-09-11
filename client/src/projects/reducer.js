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

const initialState = {
  byIds: {},
  ajax: {},
}

export default function projects(state = initialState, action) {
  switch(action.type) {
  case t.SETUP: {
    let projectsByIds = {}
    action.payload.projects.forEach(project => {
      projectsByIds[project.id] = project
    })
    return {
      ...state,
      byIds: projectsByIds,
    }
  }
  case t.ADD: {
    const { project } = action.payload
    return {
      ...state,
      byIds: {
        ...state.byIds,
        [project.id]: project,
      },
    }
  }
  case t.REMOVE: {
    let nextState = { ...state.byIds }
    delete nextState[action.payload.project.id]
    return {
      ...state,
      byIds: nextState,
    }
  }
  case t.UPDATE:
  case t.UPDATE_MOOD:
    const projectId = action.payload.project.id
    return {
      ...state,
      byIds: {
        ...state.byIds,
        [projectId]: project(state.byIds[projectId], action)
      }
    }
  case t.SET_PROJECT_AJAX: {
    const { key, value } = action.payload
    return {
      ...state,
      ajax: {
        ...state.ajax,
        [key]: value,
      },
    }
  }
  default:
    return state
  }
}
