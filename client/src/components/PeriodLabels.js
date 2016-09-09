import React, { Component } from 'react'
import moment from 'moment'

import './PeriodLabels.css'

export default class PeriodLabels extends Component {
  render() {
    const { displayedPeriod } = this.props

    let activeMonth = null
    let nodes = []
    displayedPeriod.by('weeks', date => {
      let label = null
      if (activeMonth !== date.month()) {
        activeMonth = date.month()
        label = date.format('MMM')

        if (activeMonth === 0) {
          label += ' ' + date.format('YYYY')
        }
      }
      nodes.push(
        <div
          key={ date.week() }
          className={ 'period-label' + (moment().month() === activeMonth ? ' period-label-active' : '') }
        >
          { label }
        </div>
      )
    })

    return (
      <div className="period-labels">
        { nodes }
      </div>
    )
  }

  shouldComponentUpdate(nextProps, nextState) {
    return false
  }
}
