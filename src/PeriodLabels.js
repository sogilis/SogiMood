import React, { Component } from 'react';

export default class PeriodLabels extends Component {
  render() {
    const { displayedPeriod } = this.props

    let currentMonth = null
    let nodes = []
    displayedPeriod.by('weeks', date => {
      let label = null
      if (currentMonth !== date.month()) {
        currentMonth = date.month()
        label = date.format('MMM')

        if (currentMonth === 0) {
          label += ' ' + date.format('YYYY')
        }
      }
      nodes.push(
        <div
          key={ date.week() }
          className="period-label"
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
}
