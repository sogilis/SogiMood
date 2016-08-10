import React, { Component } from 'react';
import moment from 'moment';
import Popover from './Popover';
import { Menu, MenuItem } from './Menu';
import SnapMood from './SnapMood';

class ProjectMenu extends Component {
  handleDeleteProject(e) {
    e.preventDefault()
    this.props.deleteProject()
  }

  handleToggleArchiveProject(e) {
    e.preventDefault()
    this.props.toggleArchiveProject()
  }

  render() {
    return (
      <Menu>
        { /* <MenuItem onClick={ this.handleToggleArchiveProject.bind(this) }>
          { this.props.project.archived ? 'Désarchiver' : 'Archiver' }
          </MenuItem> */ }
        <MenuItem
          confirm="Êtes-vous sûr de vouloir supprimer ce projet ?"
          onClick={ this.handleDeleteProject.bind(this) }
        >
          Supprimer
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
      startedAt: moment(this.startedAt.value, 'DD/MM/YYYY').valueOf(),
      dueAt: moment(this.dueAt.value, 'DD/MM/YYYY').valueOf(),
      finishedAt: moment(this.finishedAt.value, 'DD/MM/YYYY').valueOf(),
    })
  }

  handleToggleVisibility(e) {
    e.preventDefault()
    this.setState({ opened: !this.state.opened })
  }

  warningNode() {
    const { project } = this.props
    if (!project.description) {
      return (
        <i className="project-warning fa fa-exclamation-triangle" title="La description du projet n'a pas été renseignée" />
      )
    }
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
      <form className="project-details" onSubmit={ this.handleUpdateDetails.bind(this) }>
        <div className="form-group">
          <label htmlFor={ 'project-started-on-' + project.id }>
            Début du projet
          </label>
          <input
            id={ 'project-started-on-' + project.id }
            ref={ ref => { this.startedAt = ref } }
            type="date"
            defaultValue={ project.startedAt === 0 ? '' : moment(project.startedAt).format('DD/MM/YYYY') }
            placeholder="dd/mm/yyyy"
            pattern="\d{2}/\d{2}/\d{4}"
          />
        </div>

        <div className="form-group">
          <label htmlFor={ 'project-initial-ended-on-' + project.id }>
            Fin du projet (contrat)
          </label>
          <input
            id={ 'project-initial-ended-on-' + project.id }
            ref={ ref => { this.dueAt = ref } }
            type="date"
            defaultValue={ project.dueAt === 0 ? '' : moment(project.dueAt).format('DD/MM/YYYY') }
            placeholder="dd/mm/yyyy"
            pattern="\d{2}/\d{2}/\d{4}"
          />
        </div>

        <div className="form-group">
          <label htmlFor={ 'project-estimated-ended-on-' + project.id }>
            Fin du projet (réestimée)
          </label>
          <input
            id={ 'project-estimated-ended-on-' + project.id }
            ref={ ref => { this.finishedAt = ref } }
            type="date"
            defaultValue={ project.finishedAt === 0 ? '' : moment(project.finishedAt).format('DD/MM/YYYY') }
            placeholder="dd/mm/yyyy"
            pattern="\d{2}/\d{2}/\d{4}"
          />
        </div>

        <label htmlFor={ 'project-description-' + project.id }>
          Description
        </label>
        <textarea
          id={ 'project-description-' + project.id }
          ref={ ref => { this.description = ref } }
          defaultValue={ project.description }
        />

        <div className="form-group">
          <input type="submit" value="Valider" />
        </div>
      </form>
    )
  }

  render() {
    const { project } = this.props

    return (
      <div className={ 'project' + (this.state.opened ? ' project-active' : '') }>
        <div className="project-header">
          <div className="project-header-actions">
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
                project={ project }
                toggleArchiveProject={ this.props.toggleArchiveProject }
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

            { this.warningNode() }

            <input
              className="project-name"
              ref={ ref => { this.name = ref } }
              onBlur={ this.handleChangeProjectName.bind(this) }
              defaultValue={ project.name }
            />
          </div>

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
