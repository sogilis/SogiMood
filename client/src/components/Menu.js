import React, { Component } from 'react'
import './Menu.css'

export class MenuItem extends Component {
  handleOnClick(e) {
    if (this.props.disabled) {
      e.preventDefault()
      return
    }

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
      <li className={ 'menu-item' + className + (this.props.disabled ? ' disabled' : '') }>
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
