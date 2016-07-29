import React, { Component } from 'react';
import Popover from './Popover';
import { Menu, MenuItem } from './Menu';

const MOODS = ['unknown', 'happy', 'so-so', 'sad']
const MOODS_FR = {
  'unknown': '',
  'happy': 'bien',
  'so-so': 'moyen',
  'sad': 'mauvais',
}

class AddMoodButton extends Component {
  handleAddMood(e) {
    e.preventDefault()
    this.props.addMood('unknown');
  }

  render() {
    return(
      <a
        className="mood-snap mood-snap-add"
        href="#"
        onClick={ this.handleAddMood.bind(this) }>
        +
      </a>
    )
  }
}

class SnapMoodForm extends Component {
  handleChangeMood(e) {
    e.preventDefault()
    e.stopPropagation()
    const currentMoodIndex = MOODS.findIndex(mood => mood === this.props.mood.value)
    const nextMoodIndex = (currentMoodIndex + 1) % MOODS.length
    this.props.changeMood(this.props.index, MOODS[nextMoodIndex])
  }

  handleSetMoodNote(e) {
    e.preventDefault()
    this.props.setNote(this.props.index, this.note.value)
  }

  render() {
    const { mood } = this.props
    return (
      <div className="mood-snap-form">
        <a
          className={ 'mood-snap mood-snap-block mood-snap-' + mood.value }
          href="#"
          onClick={ this.handleChangeMood.bind(this) }
        >
          { MOODS_FR[mood.value] }
        </a>

        <textarea
          ref={ ref => { this.note = ref } }
          onChange={ this.handleSetMoodNote.bind(this) }
          value={ mood.note }
        />
      </div>
    )
  }
}

class SnapMood extends Component {
  handleClickForPopover(e) {
    e.preventDefault()
    this.popover.toggle(e)
  }

  render() {
    const { mood } = this.props
    return (
      <div
        className={ 'mood-snap mood-snap-' + mood.value }
        href="#"
        onClick={ this.handleClickForPopover.bind(this) }
      >
        { mood.note ? <i className="fa fa-comment-o" /> : null }

        <Popover ref={ ref => { this.popover = ref } }>
          <SnapMoodForm
            index={ this.props.index }
            mood={ mood }
            changeMood={ this.props.changeMood }
            setNote={ this.props.setNote }
          />
        </Popover>
      </div>
    )
  }
}

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

  handleClickForPopover(e) {
    e.preventDefault()
    this.popover.toggle(e)
  }

  handleChangeProjectName(e) {
    e.preventDefault()
    this.props.update({
      name: this.name.value
    })
  }

  handleChangeDescription(e) {
    e.preventDefault()
    this.props.update({
      description: this.description.value
    })
  }

  handleChangeStartedOn(e) {
    e.preventDefault()
    this.props.update({
      startedOn: this.startedOn.value
    })
  }

  handleChangeInitialEndedOn(e) {
    e.preventDefault()
    this.props.update({
      initialEndedOn: this.initialEndedOn.value
    })
  }

  handleChangeEstimateEndedOn(e) {
    e.preventDefault()
    this.props.update({
      estimateEndedOn: this.estimateEndedOn.value
    })
  }

  handleToggleVisibility(e) {
    e.preventDefault()
    this.setState({ opened: !this.state.opened })
  }

  moodSnapNodes() {
    let i = 0
    return this.props.project.moods.map(mood =>
      <SnapMood
        index={ i }
        key={ i++ }
        mood={ mood }
        changeMood={ this.props.changeMood }
        setNote={ this.props.setNote }
      />
    )
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
            onChange={ this.handleChangeStartedOn.bind(this) }
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
            onChange={ this.handleChangeInitialEndedOn.bind(this) }
            value={ project.initialEndedOn }
          />
        </div>

        <div className="form-group">
          <label htmlFor={ 'project-estimate-ended-on-' + project.id }>
            Fin du projet (réestimée)
          </label>
          <input
            id={ 'project-estimate-ended-on-' + project.id }
            ref={ ref => { this.estimateEndedOn = ref } }
            type="date"
            onChange={ this.handleChangeEstimateEndedOn.bind(this) }
            value={ project.estimateEndedOn }
          />
        </div>

        <label htmlFor={ 'project-description-' + project.id }>
          Description
        </label>
        <textarea
          id={ 'project-description-' + project.id }
          ref={ ref => { this.description = ref } }
          value={ project.description }
          onChange={ this.handleChangeDescription.bind(this) }
        />
      </div>
    )
  }

  render() {
    const { project, addMood } = this.props

    return (
      <div className={ 'project' + (this.state.opened ? ' project-active' : '') }>
        <div className="project-header">
          <a
            ref={ ref => { this.manageButton = ref } }
            className="project-manage-button"
            href="#"
            onClick={ this.handleClickForPopover.bind(this) }
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

          <AddMoodButton addMood={ addMood } />

          <div className="mood-period">
            { this.moodSnapNodes() }
          </div>
        </div>

        { this.projectDetailsNode() }
      </div>
    )
  }
}

export default Project
