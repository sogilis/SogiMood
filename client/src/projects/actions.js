import notifications from '../notifications'

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
      .catch(ex => {
        console.log(ex)
        dispatch(notifications.actions.error("Une erreur est survenue lors de la récupération des projets."))
      })
  }
}

export function requestCreate() {
  return (dispatch, getState, { ENDPOINT, TOKEN }) => {
    const body = build()
    return fetch(`${ ENDPOINT }/project`, init(TOKEN, 'POST', body))
      .then(response => response.json())
      .then(project => {
        dispatch(add(project))
        dispatch(notifications.actions.success("Le projet a bien été créé."))
      })
      .catch(ex => {
        console.log(ex)
        dispatch(notifications.actions.error("Une erreur est survenue lors de la création du projet."))
      })
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
      .then(project => {
        dispatch(update(project))
        dispatch(notifications.actions.success("Le projet a bien été mis à jour."))
      })
      .catch(ex => {
        console.log(ex)
        dispatch(notifications.actions.error("Une erreur est survenue lors de la mise à jour du projet."))
      })
  }
}

export function requestDelete(project) {
  return (dispatch, getState, { ENDPOINT, TOKEN }) => {
    return fetch(`${ ENDPOINT }/project?id=${ project.id }`, init(TOKEN, 'DELETE'))
      .then(() => {
        dispatch(remove(project))
        dispatch(notifications.actions.success("Le projet a bien été supprimé."))
      })
      .catch(ex => {
        console.log(ex)
        dispatch(notifications.actions.error("Une erreur est survenue lors de la suppression du projet."))
      })
  }
}

export function requestUpdateMood(project, weekNumber, data) {
  return (dispatch, getState, { ENDPOINT, TOKEN }) => {
    return fetch(`${ ENDPOINT }/mood?id=${ project.id }&weekNo=${ weekNumber }`, init(TOKEN, 'POST', data))
      .then(() => {
        dispatch(updateMood(project, weekNumber, data))
        dispatch(notifications.actions.success("L'humeur a bien été mise à jour."))
      })
      .catch(ex => {
        console.log(ex)
        dispatch(notifications.actions.error("Une erreur est survenue lors de la mise à jour de l'humeur."))
      })
  }
}
