import React, { Component } from 'react'
import moment from 'moment'
import projects, { Projects } from './projects'
import PeriodLabels from './components/PeriodLabels'
import TokenModal from './components/TokenModal'

import './App.css'

class App extends Component {
  constructor(props) {
    super(props)

    const startingDate = moment().subtract(15, 'weeks')
    const endingDate = moment().add(36, 'weeks')

    this.state = {
      showArchives: false,
      displayedPeriod: moment.range(startingDate, endingDate),
    }

    this.props.dispatch(projects.actions.requestFetch())
  }

  handleCreateProject(e) {
    e.preventDefault()
    this.props.dispatch(projects.actions.requestCreate())
  }

  handleToggleShowArchives(e) {
    e.preventDefault()
    this.setState({
      showArchives: !this.state.showArchives,
    })
  }

  projectsNodes(listProjects) {
    return (
      <Projects
        projects={ listProjects }
        displayedPeriod={ this.state.displayedPeriod }
        toggleArchiveProject={ project => this.props.dispatch(projects.actions.requestUpdate(project, { archived: !project.archived })) }
        removeProject={ project => this.props.dispatch(projects.actions.requestDelete(project)) }
        updateProject={ (project, data) => this.props.dispatch(projects.actions.requestUpdate(project, data)) }
        updateMoodByWeek={ (project, weekNumber, data) => this.props.dispatch(projects.actions.requestUpdateMood(project, weekNumber, data)) }
      />
    )
  }

  archivedProjectsNode(listProjects) {
    if (listProjects.length <= 0) {
      return null
    }

    if (!this.state.showArchives) {
      return (
        <a
          className="projects-archived-switch"
          href="#"
          onClick={ this.handleToggleShowArchives.bind(this) }
        >
          <i className="fa fa-archive" />
          { listProjects.length === 1 ? 'Afficher le projet archivé' : `Afficher les ${ listProjects.length } projets archivés` }
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
          { listProjects.length === 1 ? 'Masquer le projet archivé' : 'Masquer les projets archivés' }
        </a>

        { this.projectsNodes(listProjects) }
      </div>
    )
  }

  render() {
    return (
      <div className="app">
        <div className="app-header">
          <div className="app-title">SogiMood v0.5-alpha</div>

          <a
            className="app-token-opener"
            href="#"
            onClick={ e => {
              e.preventDefault()
              this.tokenModal.open()
            } }
          >
            Token
          </a>
        </div>

        <div className="projects">
          <PeriodLabels displayedPeriod={ this.state.displayedPeriod } />

          { this.projectsNodes(projects.selectors.getNonArchived(this.props.appState)) }

          <PeriodLabels displayedPeriod={ this.state.displayedPeriod } />

          <a
            className="projects-add-button"
            href="#"
            onClick={ this.handleCreateProject.bind(this) }
          >
            <i className="fa fa-plus" />
            Ajouter un projet
          </a>

          { this.archivedProjectsNode(projects.selectors.getArchived(this.props.appState)) }
        </div>

        <TokenModal
          ref={ ref => this.tokenModal = ref }
          initialValues={{ token: localStorage.getItem('token') }}
          onSubmit={ data => {
            localStorage.setItem('token', data.token)
            location.reload()
          } }
        />
      </div>
    )
  }
}

export default App
