import * as t from './actionTypes'

export default function notifications(state = {}, action) {
  switch(action.type) {
  case t.ADD: {
    const { notification } = action.payload
    return {
      ...state,
      [notification.id]: notification,
    }
  }
  case t.CLOSE: {
    let nextState = { ...state }
    delete nextState[action.payload.notification.id]
    return nextState
  }
  default:
    return state
  }
}
