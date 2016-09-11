import React, { Component } from 'react'
import Modal from './Modal'
import TokenForm from './TokenForm'

export default class TokenModal extends Component {
  constructor(props) {
    super(props)
    this.state = {
      enableCancel: true
    }
  }

  open(enableCancel = true) {
    this.setState({ enableCancel })
    this.modal.open()
  }

  render() {
    return (
      <Modal
        title="Saisir le token d'accès"
        ref={ ref => this.modal = ref }
        enableCancel={ this.state.enableCancel }
      >
        <TokenForm
          initialValues={ this.props.initialValues }
          onSubmit={ this.props.onSubmit }
        />
      </Modal>
    )
  }
}
