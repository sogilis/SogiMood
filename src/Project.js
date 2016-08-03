import React, { Component } from 'react';
import Popover from './Popover';
import { Menu, MenuItem } from './Menu';
import SnapMood from './SnapMood';

class ProjectMenu extends Component {
  handleDeleteProject(e) {
    e.preventDefault()
    this.props.deleteProject()
  }

  render() {
    return (
      <Menu>
        <MenuItem>
          <a href="#" onClick={ this.handleDeleteProject.bind(this) }>Supprimer</a>
        </MenuItem>
      </Menu>
    );
  }
}

class Project extends Component {
  constructor(props) {
    super(props)
    this.state = { opened: false }
  }

  handleChangeProjectName(e) {
    e.preventDefault()
    this.props.update({
      name: this.name.value
    })
  }

  handleUpdateDetails(e) {
    e.preventDefault()
    this.props.update({
      description: this.description.value,
      startedOn: this.startedOn.value,
      initialEndedOn: this.initialEndedOn.value,
      estimatedEndedOn: this.estimatedEndedOn.value,
    })
  }

  handleToggleVisibility(e) {
    e.preventDefault()
    this.setState({ opened: !this.state.opened })
  }

  moodPeriodNodes() {
    const { project, updateMoodByWeek, displayedPeriod } = this.props

    let nodes = []
    displayedPeriod.by('weeks', date => {
      const weekNumber = date.week()
      nodes.push(
        <SnapMood
          key={ weekNumber }
          project={ project }
          date={ date }
          mood={ project.moodsByWeek[weekNumber] }
          updateMood={ data => updateMoodByWeek(weekNumber, data) }
        />
      )
    })

    return nodes
  }

  projectDetailsNode() {
    if (!this.state.opened) {
      return null
    }

    const { project } = this.props

    return (
      <div className="project-details">
        <div className="form-group">
          <label htmlFor={ 'project-started-on-' + project.id }>
            Début du projet
          </label>
          <input
            id={ 'project-started-on-' + project.id }
            ref={ ref => { this.startedOn = ref } }
            type="date"
            onChange={ this.handleUpdateDetails.bind(this) }
            value={ project.startedOn }
          />
        </div>

        <div className="form-group">
          <label htmlFor={ 'project-initial-ended-on-' + project.id }>
            Fin du projet
          </label>
          <input
            id={ 'project-initial-ended-on-' + project.id }
            ref={ ref => { this.initialEndedOn = ref } }
            type="date"
            onChange={ this.handleUpdateDetails.bind(this) }
            value={ project.initialEndedOn }
          />
        </div>

        <div className="form-group">
          <label htmlFor={ 'project-estimated-ended-on-' + project.id }>
            Fin du projet (réestimée)
          </label>
          <input
            id={ 'project-estimated-ended-on-' + project.id }
            ref={ ref => { this.estimatedEndedOn = ref } }
            type="date"
            onChange={ this.handleUpdateDetails.bind(this) }
            value={ project.estimatedEndedOn }
          />
        </div>

        <label htmlFor={ 'project-description-' + project.id }>
          Description
        </label>
        <textarea
          id={ 'project-description-' + project.id }
          ref={ ref => { this.description = ref } }
          value={ project.description }
          onChange={ this.handleUpdateDetails.bind(this) }
        />
      </div>
    )
  }

  render() {
    const { project } = this.props

    return (
      <div className={ 'project' + (this.state.opened ? ' project-active' : '') }>
        <div className="project-header">
          <a
            ref={ ref => { this.manageButton = ref } }
            className="project-manage-button"
            href="#"
            onClick={ e => this.popover.toggle(e) }
          >
            <i className="fa fa-cog" />
          </a>

          <Popover ref={ ref => { this.popover = ref } }>
            <ProjectMenu
              deleteProject={ this.props.deleteProject }
            />
          </Popover>

          <a
            className="project-opener-button"
            href="#"
            onClick={ this.handleToggleVisibility.bind(this) }
          >
            <i className={ 'fa ' + (this.state.opened ? 'fa-caret-down' : 'fa-caret-right') } />
          </a>

          <input
            className="project-name"
            ref={ ref => { this.name = ref } }
            onChange={ this.handleChangeProjectName.bind(this) }
            value={ project.name }
          />

          <div className="mood-period">
            { this.moodPeriodNodes() }
          </div>
        </div>

        { this.projectDetailsNode() }
      </div>
    )
  }

  shouldComponentUpdate(nextProps, nextState) {
    return this.props.project !== nextProps.project || this.state !== nextState
  }
}

export default Project
