import React, { Component } from 'react'

import './Modal.css'

export class ConfirmModal extends Component {
  confirm(callback) {
    this.callback = callback
    this.modal.open()
  }

  onOpen() {
    this.confirmButton.focus()
  }

  handleConfirm(e) {
    e.preventDefault()
    if (this.callback != null) {
      this.callback()
    }
    this.modal.close()
  }

  handleCancel(e) {
    e.preventDefault()
    this.modal.close()
  }

  render() {
    return (
      <Modal
        title="Confirmation"
        ref={ ref => this.modal = ref }
        enableCancel={ false }
        className="modal-confirm"
        listener={ this }
      >
        <div className="modal-confirm-msg">
          { this.props.children }
        </div>

        <div className="form-group">
          <a
            href="#"
            onClick={ this.handleConfirm.bind(this) }
            className="btn btn-primary"
            ref={ ref => this.confirmButton = ref }
          >
            Confirmer
          </a>

          <a
            href="#"
            onClick={ this.handleCancel.bind(this) }
            className="btn btn-link"
          >
            Annuler
          </a>
        </div>
      </Modal>
    )
  }
}

export default class Modal extends Component {
  constructor(props) {
    super(props)
    this.state = {
      opened: false,
    }
    this.listeners = []
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

    const className = this.props.className || ''

    const { listener } = this.props
    if (listener != null) {
      this.listeners.push(listener)
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

        <div className={ 'modal ' + className }>
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

  componentDidUpdate() {
    if (this.state.opened) {
      this.listeners.forEach(listener => listener.onOpen())
    }
  }
}
