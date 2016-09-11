import React, { Component } from 'react'
import moment from 'moment'

import { AlertInfo, AlertLoading } from './alerts'

import notifications, { NotificationCenter } from './notifications'

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
    if (listProjects.length <= 0) {
      return (
        <AlertInfo>
          Il n'y a aucun projet à afficher.
        </AlertInfo>
      )
    }

    return (
      <Projects
        projects={ listProjects }
        displayedPeriod={ this.state.displayedPeriod }
        toggleArchiveProject={ project => this.props.dispatch(projects.actions.requestUpdate(project, { archived: !project.archived })) }
        removeProject={ project => this.props.dispatch(projects.actions.requestDelete(project)) }
        updateProject={ (project, data) => this.props.dispatch(projects.actions.requestUpdate(project, data)) }
        updateMoodByWeek={ (project, weekNumber, data) => this.props.dispatch(projects.actions.requestUpdateMood(project, weekNumber, data)) }

        isProjectUpdating={ project => projects.selectors.isUpdating(this.props.appState, project) }
        isProjectDeleting={ project => projects.selectors.isDeleting(this.props.appState, project) }
        isMoodUpdating={ (project, weekNumber) => projects.selectors.isMoodUpdating(this.props.appState, project, weekNumber) }
      />
    )
  }

  archivedProjectsNode(listProjects) {
    if (listProjects.length <= 0) {
      return null
    }

    return (
      <div>
        { this.state.showArchives ?
          <a
            className="btn btn-link projects-archived-switch"
            href="#"
            onClick={ this.handleToggleShowArchives.bind(this) }
          >
            <i className="fa fa-folder-open" /> { listProjects.length === 1 ? 'Masquer le projet archivé' : 'Masquer les projets archivés' }
          </a>
        :
          <a
            className="btn btn-link projects-archived-switch"
            href="#"
            onClick={ this.handleToggleShowArchives.bind(this) }
          >
            <i className="fa fa-folder" /> { listProjects.length === 1 ? 'Afficher le projet archivé' : `Afficher les ${ listProjects.length } projets archivés` }
          </a>
        }

        { this.state.showArchives ? this.projectsNodes(listProjects) : null }
      </div>
    )
  }

  appContentNode() {
    if (projects.selectors.isFetching(this.props.appState)) {
      return (
        <div className="app-content">
          <AlertLoading>
            Chargement des projets en cours…
          </AlertLoading>
        </div>
      )
    }

    return (
      <div className="app-content">
        <PeriodLabels displayedPeriod={ this.state.displayedPeriod } />

        { this.projectsNodes(projects.selectors.getNonArchived(this.props.appState)) }

        <PeriodLabels displayedPeriod={ this.state.displayedPeriod } />

        { projects.selectors.isCreating(this.props.appState) ?
          <a
            className="btn btn-link disabled"
            href="#"
            onClick={ e => e.preventDefault() }
          >
            <i className="fa fa-plus" /> Création d'un projet en cours
          </a>
        :
          <a
            className="btn btn-link projects-create-button"
            href="#"
            onClick={ this.handleCreateProject.bind(this) }
          >
            <i className="fa fa-plus" /> Créer un projet
          </a>
        }

        { this.archivedProjectsNode(projects.selectors.getArchived(this.props.appState)) }
      </div>
    )
  }

  render() {
    return (
      <div className="app">
        <div className="app-header">
          <a href="/" className="app-title">SogiMood v0.6.0</a>

          <div className="app-header-separator" />

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

        <NotificationCenter
          notifications={ notifications.selectors.listNotifications(this.props.appState) }
          closeNotification={ notification => this.props.dispatch(notifications.actions.close(notification)) }
        />

        { this.appContentNode() }

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

  componentWillMount() {
    if (localStorage.getItem('token') != null) {
      this.props.dispatch(projects.actions.requestFetch())
    }
  }

  componentDidMount() {
    if (localStorage.getItem('token') == null) {
      this.tokenModal.open(false)
    }
  }
}

export default App
