import React, { Component } from 'react';
import moment from 'moment';
import Project from './Project';
import projectsReducer, {
  setupProjects,
  addProject,
  deleteProject,
  updateProject,
  updateMood,
  requestProjects,
  requestCreateProject,
  requestUpdateProject,
  requestDeleteProject,
  requestUpdateMood,
  listProjects,
  sortByEndDate,
  keepNonArchivedProjects,
  keepArchivedProjects,
} from './projects';
import PeriodLabels from './PeriodLabels';

class App extends Component {
  constructor(props) {
    super(props)

    this.state = {
      token: localStorage.getItem('token') || '',
      projects: [],
    }
    this.isSync = true
    this.storeTimeout = null

    const startingDate = moment().subtract(15, 'weeks')
    const endingDate = moment().add(36, 'weeks')
    this.displayedPeriod = moment.range(startingDate, endingDate)

    requestProjects(this.state.token).then(projects => {
      this.updateState(setupProjects(projects || []))
    })
  }

  updateState(action) {
    const nextState = projectsReducer(this.state, action)
    this.setState(nextState)
  }

  handleCreateProject(e) {
    e.preventDefault()
    requestCreateProject(this.state.token).then(project => {
      this.updateState(addProject(project))
    })
  }

  handleToggleShowArchives(e) {
    e.preventDefault()
    this.showArchives = !this.showArchives
    this.forceUpdate()
  }

  projectsNodes(projects) {
    return projects.map(project =>
      <Project
        key={ project.id }
        project={ project }
        displayedPeriod={ this.displayedPeriod }
        toggleArchiveProject={ () => requestUpdateProject(project, { archived: !project.archived }, this.state.token).then(project => this.updateState(updateProject(project))) }
        deleteProject={ () => requestDeleteProject(project, this.state.token).then(() => this.updateState(deleteProject(project))) }
        update={ data => requestUpdateProject(project, data, this.state.token).then(project => this.updateState(updateProject(project))) }
        updateMoodByWeek={ (weekNumber, data) => requestUpdateMood(project, weekNumber, data, this.state.token).then(() => this.updateState(updateMood(project, weekNumber, data))) }
      />
    )
  }

  archivedProjectsNode(projects) {
    if (projects.length <= 0) {
      return null
    }

    if (!this.showArchives) {
      return (
        <a
          className="projects-archived-switch"
          href="#"
          onClick={ this.handleToggleShowArchives.bind(this) }
        >
          <i className="fa fa-archive" />
          { projects.length === 1 ? 'Afficher le projet archivé' : `Afficher les ${ projects.length } projets archivés` }
        </a>
      )
    }

    return (
      <div>
        <a
          className="projects-archived-switch"
          href="#"
          onClick={ this.handleToggleShowArchives.bind(this) }
        >
          <i className="fa fa-archive" />
          { projects.length === 1 ? 'Masquer le projet archivé' : 'Masquer les projets archivés' }
        </a>

        { this.projectsNodes(projects) }
      </div>
    )
  }

  render() {
    if (this.state == null) {
      return <div>Loading…</div>
    }

    const projects = listProjects(this.state)
    const nonArchivedProjects = sortByEndDate(keepNonArchivedProjects(projects))
    const archivedProjects = sortByEndDate(keepArchivedProjects(projects))

    return (
      <div className="app">
        <div className="app-header">
          SogiMood v0.2-alpha
        </div>

        <div className="projects">
          <PeriodLabels displayedPeriod={ this.displayedPeriod } />

          { this.projectsNodes(nonArchivedProjects) }

          <PeriodLabels displayedPeriod={ this.displayedPeriod } />

          <a
            className="projects-add-button"
            href="#"
            onClick={ this.handleCreateProject.bind(this) }
          >
            <i className="fa fa-plus" />
            Ajouter un projet
          </a>

          { this.archivedProjectsNode(archivedProjects) }
        </div>
      </div>
    )
  }
}

export default App
