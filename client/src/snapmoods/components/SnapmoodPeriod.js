import React, { Component } from 'react'

import SnapmoodItem from './SnapmoodItem'

import './SnapmoodPeriod.css'

class SnapmoodPeriod extends Component {
  render() {
    const { period, updateMoodByWeek, isMoodUpdating } = this.props
    return (
      <div className="mood-period">
        { period.map(week =>
          <SnapmoodItem
            key={ week.number }
            week={ week }
            updateMood={ updateMoodByWeek }
            isUpdating={ isMoodUpdating }
          />
        ) }
      </div>
    )
  }
}

export default SnapmoodPeriod
