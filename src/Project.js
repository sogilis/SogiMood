import React, { Component } from 'react';
import Popover from './Popover';
import { Menu, MenuItem } from './Menu';

const MOODS = ['unknown', 'happy', 'so-so', 'sad']

class AddMoodButton extends Component {
  handleAddMood(e) {
    e.preventDefault()
    this.props.addMood()
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

class SnapMoodInput extends Component {
  handleOnChange(e, mood) {
    e.preventDefault()
    this.props.onChange(mood)
  }

  render() {
    return (
      <div className="mood-input">
        { MOODS.map(mood =>
          <a
            key={ mood }
            className={ 'mood-snap mood-snap-' + mood }
            href="#"
            onClick={ e => this.handleOnChange(e, mood) }
          >
            { this.props.value === mood ? <i className="fa fa-check" /> : <span>&nbsp;</span> }
          </a>
        ) }
      </div>
    )
  }
}

class SnapMoodForm extends Component {
  handleSetMoodNote(e) {
    e.preventDefault()
    this.props.setNote(this.props.index, this.note.value)
  }

  render() {
    const { mood } = this.props
    return (
      <div className="mood-snap-form">
        <div className="form-group">
          <label>Humeur du client</label>
          <SnapMoodInput
            value={ mood.customer }
            onChange={ value => this.props.changeMood(this.props.index, 'customer', value) }
          />
        </div>

        <div className="form-group">
          <label>Humeur de l'équipe</label>
          <SnapMoodInput
            value={ mood.team }
            onChange={ value => this.props.changeMood(this.props.index, 'team', value) }
          />
        </div>

        <div className="form-group">
          <label>Santé financière</label>
          <SnapMoodInput
            value={ mood.finance }
            onChange={ value => this.props.changeMood(this.props.index, 'finance', value) }
          />
        </div>

        <label>Informations supplémentaires</label><br />
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
  getValue(mood) {
    if (mood === 'happy') return 1
    if (mood === 'sad') return -1
    return 0
  }

  globalMood() {
    const { customer, team, finance } = this.props.mood
    if (customer === 'unknown' && team === 'unknown' && finance === 'unknown') {
      return 'unknown'
    }

    const customerValue = this.getValue(customer)
    const teamValue = this.getValue(team)
    const financeValue = this.getValue(finance)
    const globalValue = customerValue + teamValue + financeValue

    if (globalValue >= 2) return 'happy'
    if (globalValue <= -3) return 'wtf'
    if (globalValue <= -1) return 'sad'
    return 'so-so'
  }

  render() {
    const { mood } = this.props
    const globalMood = this.globalMood()
    return (
      <div
        className={ 'mood-snap mood-snap-' + globalMood }
        href="#"
        onClick={ e => this.popover.toggle(e) }
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
