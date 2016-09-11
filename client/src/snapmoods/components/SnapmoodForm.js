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
    this.value = mood
    this.forceUpdate()
  }

  render() {
    return (
      <div className="mood-input">
        { MOODS.map(mood =>
          <a
            key={ mood }
            className={ 'mood-snap mood-snap-' + mood }
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
    this.props.updateMood({
      details: this.details.value,
      marker: this.marker.value,
      customer: this.customer.value,
      team: this.team.value,
      money: this.money.value,
    })
  }

  render() {
    const { mood } = this.props
    return (
      <form className="mood-snap-form" onSubmit={ this.handleUpdateMood.bind(this) }>
        <div className="form-group">
          <label>Humeur du client</label>
          <SnapmoodInput
            ref={ ref => { this.customer = ref } }
            defaultValue={ mood && mood.customer }
          />
        </div>

        <div className="form-group">
          <label>Humeur de l'équipe</label>
          <SnapmoodInput
            ref={ ref => { this.team = ref } }
            defaultValue={ mood && mood.team }
          />
        </div>

        <div className="form-group">
          <label>Santé financière</label>
          <SnapmoodInput
            ref={ ref => { this.money = ref } }
            defaultValue={ mood && mood.money }
          />
        </div>

        <div className="form-group">
          <label>Jalon</label>
          <input
            ref={ ref => { this.marker = ref } }
            defaultValue={ mood && mood.marker }
            type="text"
          />
        </div>

        <div className="form-group form-group-vertical">
          <label>Informations supplémentaires</label><br />
          <textarea
            ref={ ref => { this.details = ref } }
            defaultValue={ mood && mood.details }
          />
        </div>

        <div className="form-group form-group-actions">
          <input className="btn btn-primary" type="submit" value="Valider" />
        </div>
      </form>
    )
  }
}
