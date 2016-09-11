import React, { Component } from 'react'

import Popover from '../../components/Popover'

import { SnapmoodPeriod } from '../../snapmoods'

import ProjectMenu from './ProjectMenu'
import ProjectForm from './ProjectForm'

import './ProjectItem.css'

class ProjectItem extends Component {
  constructor(props) {
    super(props)
    this.state = { opened: false }
  }

  handleChangeName(e) {
    e.preventDefault()
    if (this.props.project.name === this.name.value) {
      return
    }
    this.props.update({ name: this.name.value })
  }

  handleToggleVisibility(e) {
    e.preventDefault()
    this.setState({ opened: !this.state.opened })
  }

  handleOnSubmit(e, data) {
    e.preventDefault()
    this.props.update(data)
  }

  warningNode() {
    if (!this.props.project.description) {
      return (
        <i className="project-warning fa fa-exclamation-triangle" title="La description du projet n'a pas été renseignée" />
      )
    }
  }

  render() {
    const { project } = this.props

    return (
      <div className={ 'project' + (this.state.opened ? ' project-active' : '') }>
        <div className="project-header">
          <div className="project-header-actions">
            <a
              ref={ ref => { this.manageButton = ref } }
              className="project-manage-button"
              href="#"
              onClick={ e => this.popover.toggle(e) }
            >
              <i className="fa fa-cog" />
            </a>

            <Popover ref={ ref => { this.popover = ref } }>
              <ProjectMenu
                project={ project }
                toggleArchive={ this.props.toggleArchive }
                remove={ this.props.remove }
              />
            </Popover>

            <a
              className="project-opener-button"
              href="#"
              onClick={ this.handleToggleVisibility.bind(this) }
            >
              <i className={ 'fa ' + (this.state.opened ? 'fa-caret-down' : 'fa-caret-right') } />
            </a>

            { this.warningNode() }

            <input
              className="project-name"
              ref={ ref => { this.name = ref } }
              onBlur={ this.handleChangeName.bind(this) }
              defaultValue={ project.name }
            />
          </div>

          <SnapmoodPeriod
            project={ project }
            updateMoodByWeek={ this.props.updateMoodByWeek }
            displayedPeriod={ this.props.displayedPeriod }
          />
        </div>

        { this.state.opened ?
          <ProjectForm
            project={ project }
            onSubmit={ this.handleOnSubmit.bind(this) }
          />
        :
          null
        }
      </div>
    )
  }

  shouldComponentUpdate(nextProps, nextState) {
    return this.props.project !== nextProps.project || this.state !== nextState
  }
}

export default ProjectItem
