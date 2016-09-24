import fetchMock from 'fetch-mock'
import helpers from './testHelpers'

it('asks for token if it is not stored in localStorage', () => {
  const app = helpers.setup()
  expect(localStorage.getItem('token')).toBeUndefined()

  expect(helpers.tokenModalIsOpened(app)).toBeTruthy()
  expect(helpers.modalCannotBeClosed(app)).toBeTruthy()
})

it('sets token in localStorage when validiting form', () => {
  const app = helpers.setup()
  expect(localStorage.getItem('token')).toBeUndefined()

  helpers.submitToken(app, 'abcd')

  expect(localStorage.setItem).toBeCalledWith('token', 'abcd')
})

it('loads projects from server automatically if token is setted', () => {
  const app = helpers.setup('initialized')
  expect(localStorage.getItem('token')).toBeDefined()

  expect(helpers.projectsFetchingFunc).toBeCalled()
})

it('creates project when clicking on create button', done => {
  const app = helpers.setup('initialized')
  const project = helpers.createNewProject(app)

  setTimeout(() => {
    expect(helpers.projectExists(app, project)).toBeTruthy()
    done()
  }, 0)
})

it('closes notification when clicking on it', done => {
  const app = helpers.setup('initialized')
  helpers.createNewProject(app)

  setTimeout(() => {
    expect(helpers.getNotificationStatus(app)).toBe('success')

    helpers.closeNotification(app)

    expect(helpers.isNotification(app)).toBeFalsy()
    done()
  }, 0)
})

it('updates project when submitting form', done => {
  const app = helpers.setup('initialized')
  const project = helpers.pickProject(app)
  helpers.changeProjectDescription(app, project, 'A new description')

  setTimeout(() => {
    const updatedProject = helpers.findProject(app, project.id)
    expect(updatedProject.description).toEqual('A new description')
    done()
  }, 0)
})

it('updates mood when submitting form', done => {
  const app = helpers.setup('initialized')
  const project = helpers.pickProject(app)
  const weekNumber = 42
  const mood = {
    customer: 'happy',
    team: 'happy',
    money: 'happy',
    details: 'Everything is OK!',
    marker: 'demo',
  }
  helpers.changeProjectMood(app, project, weekNumber, mood)

  setTimeout(() => {
    const updatedMood = helpers.findMood(app, project.id, weekNumber)
    expect(updatedMood).toEqual(mood)
    done()
  }, 0)
})

it('moves project to archive list when archiving', done => {
  const app = helpers.setup('initialized')
  const project = helpers.pickProject(app)

  helpers.archiveProject(app, project)

  setTimeout(() => {
    expect(helpers.projectExists(app, project)).toBeFalsy()
    expect(helpers.archiveExists(app, project)).toBeTruthy()
    done()
  }, 0)
})

it('deletes project when removing', done => {
  const app = helpers.setup('initialized')
  const project = helpers.pickProject(app)

  helpers.deleteProject(app, project)

  setTimeout(() => {
    expect(helpers.projectExists(app, project)).toBeFalsy()
    expect(helpers.archiveExists(app, project)).toBeFalsy()
    done()
  }, 0)
})

afterEach(() => {
  fetchMock.restore()
  localStorage.clear()
})
