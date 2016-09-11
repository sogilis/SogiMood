import * as t from './actionTypes'
import { build } from './model'

export function success(msg) {
  return dispatch => {
    let notification = build('success', msg)
    notification.timeout = window.setTimeout(() => {
      dispatch(close(notification))
    }, 5000)

    dispatch({
      type: t.ADD,
      payload: {
        notification,
      },
    })
  }
}

export function error(msg) {
  return dispatch => {
    let notification = build('error', msg)
    notification.timeout = window.setTimeout(() => {
      dispatch(close(notification))
    }, 5000)

    dispatch({
      type: t.ADD,
      payload: {
        notification,
      },
    })
  }
}

export function close(notification) {
  return dispatch => {
    window.clearTimeout(notification.timeout)

    dispatch({
      type: t.CLOSE,
      payload: {
        notification,
      },
    })
  }
}
