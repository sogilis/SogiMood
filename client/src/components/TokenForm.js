import React, { Component } from 'react'

export default class TokenForm extends Component {
  handleSubmit(e) {
    e.preventDefault()
    this.props.onSubmit({
      token: this.token.value,
    })
  }

  render() {
    return (
      <form className="token-form" onSubmit={ this.handleSubmit.bind(this) }>
        <div className="form-group">
          <label htmlFor="token">Token</label>
          <input
            id="token"
            type="text"
            ref={ ref => this.token = ref }
            defaultValue={ this.props.initialValues.token }
            onChange={ e => this.token.value = e.target.value }
            placeholder=" "
          />
        </div>
        <div className="form-group form-group-actions">
          <input className="btn btn-primary" type="submit" value="Valider" />
        </div>
      </form>
    )
  }
}
