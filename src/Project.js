import React, { Component } from 'react';
import moment from 'moment';
import Popover from './Popover';
import { Menu, MenuItem } from './Menu';

const MOODS = ['unknown', 'happy', 'so-so', 'sad']
const DATE_FORMAT = 'DD MMM YYYY'

class SnapMoodInput extends Component {
  constructor(props) {
    super(props)
    this.value = props.value || 'unknown'
    this.handleOnChange.bind(this)
  }

  handleOnChange(e, mood) {
    this.value = mood
    this.props.onChange(e)
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
            { this.value === mood ? <i className="fa fa-check" /> : <span>&nbsp;</span> }
          </a>
        ) }
      </div>
    )
  }
}

class SnapMoodForm extends Component {
  handleUpdateMood(e) {
    e.preventDefault()
    this.props.updateMood({
      note: this.note.value,
      customer: this.customer.value,
      team: this.team.value,
      finance: this.finance.value,
    })
  }

  render() {
    const { mood } = this.props
    return (
      <div className="mood-snap-form">
        <div className="form-group">
          <label>Humeur du client</label>
          <SnapMoodInput
            ref={ ref => { this.customer = ref } }
            value={ mood && mood.customer }
            onChange={ this.handleUpdateMood.bind(this) }
          />
        </div>

        <div className="form-group">
          <label>Humeur de l'équipe</label>
          <SnapMoodInput
            ref={ ref => { this.team = ref } }
            value={ mood && mood.team }
            onChange={ this.handleUpdateMood.bind(this) }
          />
        </div>

        <div className="form-group">
          <label>Santé financière</label>
          <SnapMoodInput
            ref={ ref => { this.finance = ref } }
            value={ mood && mood.finance }
            onChange={ this.handleUpdateMood.bind(this) }
          />
        </div>

        <label>Informations supplémentaires</label><br />
        <textarea
          ref={ ref => { this.note = ref } }
          value={ mood && mood.note }
          onChange={ this.handleUpdateMood.bind(this) }
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
    const { mood } = this.props
    if (!mood) {
      return 'unknown'
    }

    const { customer, team, finance } = mood

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
    const { mood, date } = this.props
    const globalMood = this.globalMood()
    const title = 'semaine ' + date.week() + ' - du ' + date.startOf('week').format(DATE_FORMAT) + ' au ' + date.endOf('week').format(DATE_FORMAT)
    const currentWeekNumber = moment().week()
    return (
      <div
        className={ 'mood-snap mood-snap-' + globalMood + (date.week() === currentWeekNumber ? ' mood-snap-active' : '') }
        href="#"
        onClick={ e => this.popover.toggle(e) }
        title={ title }
      >
        { mood && mood.note ? <i className="fa fa-comment-o" /> : null }

        <Popover ref={ ref => { this.popover = ref } }>
          <SnapMoodForm
            mood={ mood }
            updateMood={ this.props.updateMood }
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

  moodPeriodNodes() {
    const { project, updateMoodByWeek, displayedPeriod } = this.props


    let nodes = []
    displayedPeriod.by('weeks', date => {
      const weekNumber = date.week()
      nodes.push(
        <SnapMood
          key={ weekNumber }
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
}

export default Project
