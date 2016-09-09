import React, { Component } from 'react'
import moment from 'moment'

import Popover from '../../components/Popover'

import SnapmoodForm from './SnapmoodForm'

import './SnapmoodItem.css'

const DATE_FORMAT = 'DD MMM YYYY'

export default class SnapmoodItem extends Component {
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

    const { customer, team, money } = mood

    if (customer === 'unknown' && team === 'unknown' && money === 'unknown') {
      return 'unknown'
    }

    const customerValue = this.getValue(customer)
    const teamValue = this.getValue(team)
    const moneyValue = this.getValue(money)
    const globalValue = customerValue + teamValue + moneyValue

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

    const startProjectDate = moment(project.startedAt)
    if (project.startedAt && project.dueAt) {
      const initialEndProjectDate = moment(project.dueAt)
      const isInProgress = date.isBetween(startProjectDate.startOf('week'), initialEndProjectDate.endOf('week'), null, '[]')
      className += isInProgress ? ' mood-snap-in-progress' : ''
    }

    if (project.startedAt && project.finishedAt) {
      const estimatedEndProjectDate = project.finishedAt && moment(project.finishedAt)
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
        onClick={ e => this.popover.toggle(e) }
        title={ title }
      >
        { mood && mood.marker ? <i className="fa fa-thumb-tack" /> : null }
        { mood && mood.details && !mood.marker ? <i className="fa fa-comment-o" /> : null }

        <Popover ref={ ref => { this.popover = ref } }>
          <SnapmoodForm
            mood={ mood }
            updateMood={ this.props.updateMood }
          />
        </Popover>
      </div>
    )
  }

  shouldComponentUpdate(nextProps, nextState) {
    return this.props.mood !== nextProps.mood || this.props.project !== nextProps.project
  }
}
