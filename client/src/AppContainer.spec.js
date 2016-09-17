import fetchMock from 'fetch-mock'
import helpers from './testHelpers'

it('creates project when clicking on create button', done => {
  const app = helpers.setup()
  const project = helpers.createNewProject(app)

  setTimeout(() => {
    expect(helpers.projectExists(app, project)).toBeTruthy()
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

afterEach(() => {
  fetchMock.restore()
})
