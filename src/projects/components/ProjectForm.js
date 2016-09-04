import React, { Component } from 'react'
import moment from 'moment'

class ProjectForm extends Component {
  handleOnSubmit(e) {
    this.props.onSubmit(e, {
      description: this.description.value,
      startedAt: moment(this.startedAt.value, 'DD/MM/YYYY').valueOf(),
      dueAt: moment(this.dueAt.value, 'DD/MM/YYYY').valueOf(),
      finishedAt: moment(this.finishedAt.value, 'DD/MM/YYYY').valueOf(),
    })
  }

  render() {
    const { project } = this.props

    return (
      <form className="project-details" onSubmit={ this.handleOnSubmit.bind(this) }>
        <div className="form-group">
          <label htmlFor={ 'project-started-on-' + project.id }>
            Début du projet
          </label>
          <input
            id={ 'project-started-on-' + project.id }
            ref={ ref => { this.startedAt = ref } }
            type="date"
            defaultValue={ project.startedAt === 0 ? '' : moment(project.startedAt).format('DD/MM/YYYY') }
            placeholder="dd/mm/yyyy"
            pattern="\d{2}/\d{2}/\d{4}"
          />
        </div>

        <div className="form-group">
          <label htmlFor={ 'project-initial-ended-on-' + project.id }>
            Fin du projet (contrat)
          </label>
          <input
            id={ 'project-initial-ended-on-' + project.id }
            ref={ ref => { this.dueAt = ref } }
            type="date"
            defaultValue={ project.dueAt === 0 ? '' : moment(project.dueAt).format('DD/MM/YYYY') }
            placeholder="dd/mm/yyyy"
            pattern="\d{2}/\d{2}/\d{4}"
          />
        </div>

        <div className="form-group">
          <label htmlFor={ 'project-estimated-ended-on-' + project.id }>
            Fin du projet (réestimée)
          </label>
          <input
            id={ 'project-estimated-ended-on-' + project.id }
            ref={ ref => { this.finishedAt = ref } }
            type="date"
            defaultValue={ project.finishedAt === 0 ? '' : moment(project.finishedAt).format('DD/MM/YYYY') }
            placeholder="dd/mm/yyyy"
            pattern="\d{2}/\d{2}/\d{4}"
          />
        </div>

        <label htmlFor={ 'project-description-' + project.id }>
          Description
        </label>
        <textarea
          id={ 'project-description-' + project.id }
          ref={ ref => { this.description = ref } }
          defaultValue={ project.description }
        />

        <div className="form-group">
          <input type="submit" value="Valider" />
        </div>
      </form>
    )
  }
}

export default ProjectForm
