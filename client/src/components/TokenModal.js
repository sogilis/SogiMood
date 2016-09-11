import React, { Component } from 'react'
import Modal from './Modal'
import TokenForm from './TokenForm'

export default class TokenModal extends Component {
  open() {
    this.modal.open()
  }

  render() {
    return (
      <Modal title="Saisir le token d'accès" ref={ ref => this.modal = ref }>
        <TokenForm
          initialValues={ this.props.initialValues }
          onSubmit={ this.props.onSubmit }
        />
      </Modal>
    )
  }
}
