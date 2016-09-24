import React from 'react'
import { mount } from 'enzyme'
import fetchMock from 'fetch-mock'

import Store from './Store'
import rootReducer from './reducer'
import AppContainer from './AppContainer'
import projects from './projects'

const project = {
  id: 'abcd',
  name: 'Nouveau projet',
  description: '',
  startedAt: 0,
  dueAt: 0,
  finishedAt: 0,
  moodsByWeek: {},
  archived: false,
}

const projectsFetchingFunc = jest.fn(dispatch => {
  dispatch(projects.actions.setup([]))
})

function setup(option = 'uninitialized') {
  // We have to mock requestFetch if we don't want to have to wait the Promise
  // before starting to write tests...
  projects.actions.requestFetch = jest.fn(() => {
    return (dispatch, getState, options) => projectsFetchingFunc(dispatch)
  })

  const store = new Store(rootReducer)
  if (option === 'initialized') {
    localStorage.setItem('token', 'abcd')
  }
  const app = mount(<AppContainer store={ store } />)
  if (option === 'initialized') {
    store.dispatch(projects.actions.add(project))
  }
  return app
}

function tokenModalIsOpened(app) {
  return app.find('.token-modal').length === 1
}

function modalCannotBeClosed(app) {
  return app.find('.modal-close').length === 0
}

function submitToken(app, token) {
  const form = app.find('.token-form')
  const tokenField = form.find('#token')

  tokenField.simulate('change', { target: { value: token } })
  form.simulate('submit')
}

function listProjects(state) {
  const { byIds } = state.projects
  return Object.keys(byIds).map(id => byIds[id])
}

function pickProject(app) {
  return listProjects(app.state())[0]
}

function createNewProject(app) {
  fetchMock.post('/api/project', project)
  app.find('.projects-create-button').simulate('click')
  return project
}

function projectExists(app, project) {
  return app.find(`.in-progress-zone #project-${ project.id }`).length === 1
}

function changeProjectDescription(app, project, description) {
  fetchMock.post('/api/project', {
    ...project,
    description,
  })

  const wrapper = app.find(`#project-${ project.id }`)
  const projectOpener = wrapper.find(`.project-opener-button`)
  projectOpener.simulate('click')

  const form = wrapper.find('.project-details')
  const descriptionField = form.find(`#project-description-${ project.id }`)
  descriptionField.simulate('change', { target: { value: description } })
  form.simulate('submit')
}

function findProject(app, projectId) {
  const projects = listProjects(app.state())
  return projects.find(project => project.id === projectId)
}

function changeProjectMood(app, project, weekNumber, mood) {
  fetchMock.post(`/api/mood?id=${ project.id }&weekNo=${ weekNumber }`, mood)

  const wrapper = app.find(`#week-${ project.id }-${ weekNumber }`)
  wrapper.simulate('click')

  const form = wrapper.find('.mood-snap-form')
  form.find(`#mood-customer .mood-snap.${ mood.customer }`).simulate('click')
  form.find(`#mood-team .mood-snap.${ mood.team }`).simulate('click')
  form.find(`#mood-money .mood-snap.${ mood.money }`).simulate('click')
  form.find('#mood-marker').simulate('change', { target: { value: mood.marker } })
  form.find('#mood-details').simulate('change', { target: { value: mood.details } })
  form.simulate('submit')
}

function findMood(app, projectId, weekNumber) {
  const project = findProject(app, projectId)
  return project.moodsByWeek[weekNumber]
}

function archiveProject(app, project) {
  fetchMock.post('/api/project', {
    ...project,
    archived: !project.archived,
  })

  const wrapper = app.find(`#project-${ project.id }`)
  wrapper.find('.project-manage-button').simulate('click')
  wrapper.find('.menu .project-archive-item').simulate('click')
}

function archiveExists(app, project) {
  const switcher = app.find('.projects-archived-switch')
  if (switcher.length === 0) {
    return false
  }
  switcher.simulate('click')
  return app.find(`.archive-zone #project-${ project.id }`).length === 1
}

function deleteProject(app, project) {
  fetchMock.delete(`/api/project?id=${ project.id }`, {})

  const wrapper = app.find(`#project-${ project.id }`)
  wrapper.find('.project-manage-button').simulate('click')
  wrapper.find('.menu .project-remove-item').simulate('click')
  wrapper.find('.modal-confirm .btn-primary').simulate('click')
}

export default {
  setup,
  submitToken,
  tokenModalIsOpened,
  modalCannotBeClosed,
  projectsFetchingFunc,
  createNewProject,
  projectExists,
  pickProject,
  changeProjectDescription,
  findProject,
  changeProjectMood,
  findMood,
  archiveProject,
  archiveExists,
  deleteProject,
}
