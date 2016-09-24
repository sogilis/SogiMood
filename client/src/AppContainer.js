import React, { Component } from 'react'

import App from './App'

export default class AppContainer extends Component {
  constructor(props) {
    super(props)
    this.state = this.props.store.getState()
    this.props.store.subscribe(this.setState.bind(this))
  }

  render() {
    return (
      <App
        appState={ this.props.store.getState() }
        dispatch={ this.props.store.dispatch.bind(this.props.store) }
      />
    )
  }
}
