import React, { Component } from 'react'
import ReactDOM from 'react-dom'
import moment from 'moment'
import 'moment-range'

import Store from './Store'
import rootReducer from './reducer'
import App from './App'

import './style/index.css'
import './style/font-awesome.min.css'

moment.locale('fr')

class AppContainer extends Component {
  constructor(props) {
    super(props)

    this.state = {}

    this.store = new Store(rootReducer)
    this.store.subscribe(this.setState.bind(this))
  }

  render() {
    return (
      <App
        appState={ this.store.getState() }
        dispatch={ this.store.dispatch.bind(this.store) }
      />
    )
  }
}

ReactDOM.render(
  <AppContainer />,
  document.getElementById('root')
)
