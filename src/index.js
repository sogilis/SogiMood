import React from 'react';
import ReactDOM from 'react-dom';
import moment from 'moment';
import 'moment-range';
import App from './App';
import './style/index.css';
import './style/font-awesome.min.css';

moment.locale('fr')

ReactDOM.render(
  <App />,
  document.getElementById('root')
);
