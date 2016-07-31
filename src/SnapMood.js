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
