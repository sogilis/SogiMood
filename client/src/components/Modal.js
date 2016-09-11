import React, { Component } from 'react'

import './Modal.css'

export default class Modal extends Component {
  constructor(props) {
    super(props)
    this.state = {
      opened: false,
    }
  }

  open() {
    this.setState({ opened: true })
  }

  close() {
    this.setState({ opened: false })
  }

  handleClickOnClose(e) {
    e.preventDefault()
    this.close()
  }

  handleClickOnOverlay(e) {
    e.preventDefault()
    this.close()
  }

  render() {
    if (!this.state.opened) {
      return null
    }

    return (
      <div className="modal-container">
        { this.props.enableCancel ?
          <a
            href="#"
            className="modal-overlay"
            onClick={ this.handleClickOnOverlay.bind(this) }
          />
        :
          <div className="modal-overlay" />
        }

        <div className="modal">
          <div className="modal-header">
            <div className="modal-title">
              { this.props.title }
            </div>
            { this.props.enableCancel ?
              <a
                href="#"
                className="modal-close"
                onClick={ this.handleClickOnClose.bind(this) }
              >
                &times;
              </a>
            : null }
          </div>
          <div className="modal-body">
            { this.props.children }
          </div>
        </div>
      </div>
    )
  }
}
