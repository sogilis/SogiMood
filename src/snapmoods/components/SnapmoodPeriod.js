import React, { Component } from 'react'

import SnapmoodItem from './SnapmoodItem'

class SnapmoodPeriod extends Component {
  snapmoodPeriodNodes() {
    const { project, updateMoodByWeek, displayedPeriod } = this.props

    let nodes = []
    displayedPeriod.by('weeks', date => {
      const weekNumber = date.week()
      nodes.push(
        <SnapmoodItem
          key={ weekNumber }
          project={ project }
          date={ date }
          mood={ project.moodsByWeek[weekNumber] }
          updateMood={ data => updateMoodByWeek(weekNumber, data) }
        />
      )
    })

    return nodes
  }

  render() {
    return (
      <div className="mood-period">
        { this.snapmoodPeriodNodes() }
      </div>
    )
  }
}

export default SnapmoodPeriod
