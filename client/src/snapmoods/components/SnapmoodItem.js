import React, { Component } from 'react'

import Popover from '../../components/Popover'

import SnapmoodForm from './SnapmoodForm'

import './SnapmoodItem.css'

export default class SnapmoodItem extends Component {
  render() {
    const { week, updateMood, isUpdating } = this.props
    const { mood } = week

    return (
      <div
        id={ `week-${ week.id }` }
        className={ `mood-snap ${ week.isCurrent ? 'today' : '' } ${ week.projectStatus } ${ (mood && mood.status) || '' }` }
        onClick={ e => this.popover.toggle(e) }
        title={ week.label }
      >
        { isUpdating(week.number) ?
          <i className="fa fa-spinner fa-pulse" />
        : mood && mood.marker ?
          <i className="fa fa-thumb-tack" />
        : mood && mood.details ?
          <i className="fa fa-comment-o" />
        :
          null
        }

        <Popover ref={ ref => { this.popover = ref } }>
          <SnapmoodForm
            mood={ mood }
            updateMood={ data => updateMood(week.number, data) }
            isUpdating={ isUpdating(week.number) }
          />
        </Popover>
      </div>
    )
  }

  shouldComponentUpdate(nextProps, nextState) {
    return (
      this.props.week !== nextProps.week ||
      this.props.isUpdating !== nextProps.isUpdating
    )
  }
}
