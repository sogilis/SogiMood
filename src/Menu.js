import React, { Component } from 'react';
import './style/Menu.css';

export class MenuItem extends Component {
  render() {
    return (
      <li className="menu-item">
        { this.props.children }
      </li>
    )
  }
}

export class Menu extends Component {
  render() {
    return (
      <ul className="menu">
        { this.props.children }
      </ul>
    )
  }
}
