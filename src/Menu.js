import React, { Component } from 'react';
import './style/Menu.css';

export class MenuItem extends Component {
  handleOnClick(e) {
    const confirmMessage = this.props.confirm
    const { onClick } = this.props

    if (!confirmMessage || confirm(confirmMessage)) {
      onClick(e)
    }
  }

  render() {
    const confirmMessage = this.props.confirm
    const className = confirmMessage ? ' menu-item-danger' : ''
    return (
      <li className={ 'menu-item' + className }>
        <a href="#" onClick={ this.handleOnClick.bind(this) }>
          { this.props.children }
        </a>
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
