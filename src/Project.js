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
        className={ 'mood-snap mood-snap-' + mood.value + (mood.note ? ' mood-snap-has-note' : '') }
        href="#"
        onClick={ this.handleClickForPopover.bind(this) }
      >
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
  handleClickForPopover(e) {
    e.preventDefault()
    this.popover.toggle(e)
  }

  handleChangeProjectName(e) {
    e.preventDefault()
    this.props.changeName(this.name.value)
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

  render() {
    const { project, addMood } = this.props

    return (
      <div className="project">
        <a
          ref={ ref => { this.manageButton = ref } }
          className="project-manage-button"
          href="#"
          onClick={ this.handleClickForPopover.bind(this) }
        >
          <i className="fa fa-cog" />
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

        <Popover ref={ ref => { this.popover = ref } }>
          <ProjectMenu
            deleteProject={ this.props.deleteProject }
          />
        </Popover>
      </div>
    )
  }
}

export default Project
