import React, { Component } from 'react';
import Project from './Project';
import projectsReducer, { createProject, deleteProject, changeName, addMood, changeMood, setMoodNote, listProjects } from './projects';

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
        deleteProject={ () => this.updateState(deleteProject(project)) }
        changeName={ name => this.updateState(changeName(project, name)) }
        addMood={ mood => this.updateState(addMood(project, mood)) }
        changeMood={ (index, mood) => this.updateState(changeMood(project, index, mood)) }
        setNote={ (index, note) => this.updateState(setMoodNote(project, index, note)) }
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
          SogiMood v0.0-alpha
          { this.syncNode() }
        </div>

        <div className="projects">
          { this.projectsNodes() }

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
