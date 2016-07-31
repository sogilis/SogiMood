import React, { Component } from 'react';
import moment from 'moment';
import Project from './Project';
import projectsReducer, { createProject, deleteProject, updateProject, updateMood, listProjects } from './projects';
import PeriodLabels from './PeriodLabels';

class App extends Component {
  constructor(props) {
    super(props)
    const defaultState = {
      projects: { }
    }
    const storedState = localStorage.getItem('state')

    if (storedState !== null) {
      this.state = JSON.parse(storedState)
    } else {
      this.state = defaultState
      localStorage.setItem('state', JSON.stringify(this.state))
    }

    this.isSync = true
    this.storeTimeout = null

    const startingDate = moment().subtract(15, 'weeks')
    const endingDate = moment().add(36, 'weeks')
    this.displayedPeriod = moment.range(startingDate, endingDate)
  }

  updateState(action) {
    const nextState = projectsReducer(this.state, action)
    this.setState(nextState)

    if (this.storeTimeout === null) {
      this.isSync = false
      this.storeTimeout = setTimeout(() => {
        localStorage.setItem('state', JSON.stringify(this.state))
        this.storeTimeout = null
        this.isSync = true
        this.forceUpdate()
      }, 5000)
    }
  }

  handleCreateProject(e) {
    e.preventDefault()
    this.updateState(createProject())
  }

  projectsNodes() {
    const projects = listProjects(this.state)
    return projects.map(project =>
      <Project
        key={ project.id }
        project={ project }
        displayedPeriod={ this.displayedPeriod }
        deleteProject={ () => this.updateState(deleteProject(project)) }
        update={ data => this.updateState(updateProject(project, data)) }
        updateMoodByWeek={ (weekNumber, data) => this.updateState(updateMood(project, weekNumber, data)) }
      />
    )
  }

  syncNode() {
    if (this.isSync) {
      return (
        <i title="Les données sont sauvegardées" className="sync-icon fa fa-check" />
      )
    }
    return (
      <i title="Les données ne sont PAS sauvegardées" className="sync-icon fa fa-circle-o-notch" />
    )
  }

  render() {
    return (
      <div className="app">
        <div className="app-header">
          SogiMood v0.2-alpha
          { this.syncNode() }
        </div>

        <div className="projects">
          <PeriodLabels displayedPeriod={ this.displayedPeriod } />

          { this.projectsNodes() }

          <PeriodLabels displayedPeriod={ this.displayedPeriod } />

          <a
            className="projects-add-button"
            href="#"
            onClick={ this.handleCreateProject.bind(this) }
          >
            <i className="fa fa-plus" />
            Ajouter un projet
          </a>
        </div>
      </div>
    )
  }
}

export default App
