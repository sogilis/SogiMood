import React, { Component } from 'react'
import { ConfirmModal } from './Modal'
import './Menu.css'

export class MenuItem extends Component {
  handleOnClick(e) {
    e.preventDefault()
    if (this.props.disabled) {
      return
    }

    const confirmMessage = this.props.confirm
    const { onClick } = this.props

    if (confirmMessage) {
      this.confirmModal.confirm(onClick)
    } else {
      onClick()
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
        { confirmMessage ?
          <ConfirmModal ref={ ref => this.confirmModal = ref }>
            { confirmMessage }
          </ConfirmModal>
        : null }
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
