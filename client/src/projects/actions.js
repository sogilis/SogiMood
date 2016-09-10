import * as t from './actionTypes'
import { build } from './model'

export function setup(projects) {
  return {
    type: t.SETUP,
    payload: {
      projects,
    },
  }
}

export function add(project) {
  return {
    type: t.ADD,
    payload: {
      project,
    }
  }
}

export function remove(project) {
  return {
    type: t.REMOVE,
    payload: {
      project,
    },
  }
}

export function update(project) {
  return {
    type: t.UPDATE,
    payload: {
      project,
    }
  }
}

export function updateMood(project, weekNumber, data) {
  return {
    type: t.UPDATE_MOOD,
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

export function requestFetch() {
  return (dispatch, getState, { ENDPOINT, TOKEN }) => {
    return fetch(`${ ENDPOINT }/projects`, init(TOKEN))
      .then(response => response.json())
      .then(projects => dispatch(setup(projects ||[])))
      .catch(ex => console.log(ex))
  }
}

export function requestCreate() {
  return (dispatch, getState, { ENDPOINT, TOKEN }) => {
    const body = build()
    return fetch(`${ ENDPOINT }/project`, init(TOKEN, 'POST', body))
      .then(response => response.json())
      .then(project => dispatch(add(project)))
      .catch(ex => console.log(ex))
  }
}

export function requestUpdate(project, data) {
  return (dispatch, getState, { ENDPOINT, TOKEN }) => {
    const body = {
      ...project,
      ...data,
    }

    return fetch(`${ ENDPOINT }/project`, init(TOKEN, 'POST', body))
      .then(response => response.json())
      .then(project => dispatch(update(project)))
      .catch(ex => console.log(ex))
  }
}

export function requestDelete(project) {
  return (dispatch, getState, { ENDPOINT, TOKEN }) => {
    return fetch(`${ ENDPOINT }/project?id=${ project.id }`, init(TOKEN, 'DELETE'))
      .then(() => dispatch(remove(project)))
      .catch(ex => console.log(ex))
  }
}

export function requestUpdateMood(project, weekNumber, data) {
  return (dispatch, getState, { ENDPOINT, TOKEN }) => {
    return fetch(`${ ENDPOINT }/mood?id=${ project.id }&weekNo=${ weekNumber }`, init(TOKEN, 'POST', data))
      .then(() => dispatch(updateMood(project, weekNumber, data)))
      .catch(ex => console.log(ex))
  }
}
