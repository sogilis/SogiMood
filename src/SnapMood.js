import React, { Component } from 'react';
import moment from 'moment';
import Popover from './Popover';
import SnapMoodForm from './SnapMoodForm';

const DATE_FORMAT = 'DD MMM YYYY'

export default class SnapMood extends Component {
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

  getClassName() {
    const { project, date } = this.props
    let className = 'mood-snap'

    const currentWeekNumber = moment().week()
    className += date.week() === currentWeekNumber ? ' mood-snap-today' : ''

    const startProjectDate = moment(project.startedOn, 'DD/MM/YYYY')
    if (project.startedOn && project.initialEndedOn) {
      const initialEndProjectDate = moment(project.initialEndedOn, 'DD/MM/YYYY')
      const isInProgress = date.isBetween(startProjectDate.startOf('week'), initialEndProjectDate.endOf('week'), null, '[]')
      className += isInProgress ? ' mood-snap-in-progress' : ''
    }

    if (project.startedOn && project.estimatedEndedOn) {
      const estimatedEndProjectDate = project.estimatedEndedOn && moment(project.estimatedEndedOn, 'DD/MM/YYYY')
      const isInEstimatedProgress = date.isBetween(startProjectDate.startOf('week'), estimatedEndProjectDate.endOf('week'), null, '[]')
      className += isInEstimatedProgress  ? ' mood-snap-in-estimated-progress' : ''
    }

    className += ' mood-snap-' + this.globalMood()

    return className
  }

  render() {
    const { mood, date } = this.props

    const title = 'semaine ' + date.week() + ' - du ' + date.startOf('week').format(DATE_FORMAT) + ' au ' + date.endOf('week').format(DATE_FORMAT)
    return (
      <div
        className={ this.getClassName() }
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
