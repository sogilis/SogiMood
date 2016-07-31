import React, { Component } from 'react';

const MOODS = ['unknown', 'happy', 'so-so', 'sad']

class SnapMoodInput extends Component {
  constructor(props) {
    super(props)
    this.value = props.value || 'unknown'
    this.handleOnChange.bind(this)
  }

  handleOnChange(e, mood) {
    this.value = mood
    this.props.onChange(e)
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

export default class SnapMoodForm extends Component {
  handleUpdateMood(e) {
    e.preventDefault()
    this.props.updateMood({
      note: this.note.value,
      customer: this.customer.value,
      team: this.team.value,
      finance: this.finance.value,
    })
  }

  render() {
    const { mood } = this.props
    return (
      <div className="mood-snap-form">
        <div className="form-group">
          <label>Humeur du client</label>
          <SnapMoodInput
            ref={ ref => { this.customer = ref } }
            value={ mood && mood.customer }
            onChange={ this.handleUpdateMood.bind(this) }
          />
        </div>

        <div className="form-group">
          <label>Humeur de l'équipe</label>
          <SnapMoodInput
            ref={ ref => { this.team = ref } }
            value={ mood && mood.team }
            onChange={ this.handleUpdateMood.bind(this) }
          />
        </div>

        <div className="form-group">
          <label>Santé financière</label>
          <SnapMoodInput
            ref={ ref => { this.finance = ref } }
            value={ mood && mood.finance }
            onChange={ this.handleUpdateMood.bind(this) }
          />
        </div>

        <label>Informations supplémentaires</label><br />
        <textarea
          ref={ ref => { this.note = ref } }
          value={ mood && mood.note }
          onChange={ this.handleUpdateMood.bind(this) }
        />
      </div>
    )
  }
}
