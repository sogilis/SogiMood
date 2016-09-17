import React from 'react';
import ReactDOM from 'react-dom';

import moment from 'moment'
import 'moment-range'

import Store from './Store'
import rootReducer from './reducer'
import AppContainer from './AppContainer'

import './style/index.css'
import './style/font-awesome.min.css'

moment.locale('fr')

const store = new Store(rootReducer)

ReactDOM.render(
  <AppContainer store={ store } />,
  document.getElementById('root')
)
