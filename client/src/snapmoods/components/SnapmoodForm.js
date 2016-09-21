import React, { Component } from 'react'

import './SnapmoodForm.css'

const MOODS = ['unknown', 'happy', 'so-so', 'sad']

class SnapmoodInput extends Component {
  constructor(props) {
    super(props)
    this.value = this.props.defaultValue || 'unknown'
  }

  handleOnChange(e, mood) {
    e.preventDefault()
    if (this.props.disabled) {
      return
    }

    this.value = mood
    this.forceUpdate()
  }

  render() {
    return (
      <div
        id={ this.props.id }
        className={ 'mood-input' + (this.props.disabled ? ' disabled' : '') }
      >
        { MOODS.map(mood =>
          <a
            key={ mood }
            className={ 'mood-snap ' + mood }
            href="#"
            onClick={ e => this.handleOnChange(e, mood) }
          >
            { this.value === mood ? <i className="fa fa-check" /> : <span>&nbsp;</span> }
          </a>
        ) }
      </div>
    )
  }
}

export default class SnapmoodForm extends Component {
  handleUpdateMood(e) {
    e.preventDefault()
    if (this.props.isUpdating) {
      return
    }

    this.props.updateMood({
      details: this.details.value,
      marker: this.marker.value,
      customer: this.customer.value,
      team: this.team.value,
      money: this.money.value,
    })
  }

  render() {
    const { mood, isUpdating } = this.props
    return (
      <form className="mood-snap-form" onSubmit={ this.handleUpdateMood.bind(this) }>
        <div className="form-group">
          <label htmlFor="mood-customer">Humeur du client</label>
          <SnapmoodInput
            id="mood-customer"
            ref={ ref => { this.customer = ref } }
            defaultValue={ mood && mood.customer }
            disabled={ isUpdating }
          />
        </div>

        <div className="form-group">
          <label htmlFor="mood-team">Humeur de l'équipe</label>
          <SnapmoodInput
            id="mood-team"
            ref={ ref => { this.team = ref } }
            defaultValue={ mood && mood.team }
            disabled={ isUpdating }
          />
        </div>

        <div className="form-group">
          <label htmlFor="mood-money">Santé financière</label>
          <SnapmoodInput
            id="mood-money"
            ref={ ref => { this.money = ref } }
            defaultValue={ mood && mood.money }
            disabled={ isUpdating }
          />
        </div>

        <div className="form-group">
          <label htmlFor="mood-marker">Jalon</label>
          <input
            id="mood-marker"
            ref={ ref => { this.marker = ref } }
            defaultValue={ mood && mood.marker }
            type="text"
            disabled={ isUpdating }
            onChange={ e => this.marker.value = e.target.value }
          />
        </div>

        <div className="form-group form-group-vertical">
          <label htmlFor="mood-details">Informations supplémentaires</label><br />
          <textarea
            id="mood-details"
            ref={ ref => { this.details = ref } }
            defaultValue={ mood && mood.details }
            disabled={ isUpdating }
            onChange={ e => this.details.value = e.target.value }
          />
        </div>

        <div className="form-group form-group-actions">
          <input
            className={ 'btn btn-primary' + (isUpdating ? ' disabled' : '') }
            type="submit"
            value={ isUpdating ? 'Validation en cours…' : 'Valider' }
          />
        </div>
      </form>
    )
  }
}
