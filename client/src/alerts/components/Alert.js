import React, { Component } from 'react'

import './Alert.css'

export class AlertInfo extends Component {
  render() {
    return (
      <div className="alert alert-info">
        <i className="alert-icon fa fa-info-circle" />
        <div className="alert-content">
          { this.props.children }
        </div>
      </div>
    )
  }
}
