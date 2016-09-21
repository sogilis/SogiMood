import React, { Component } from 'react'
import { Menu, MenuItem } from '../../components/Menu'

class ProjectMenu extends Component {
  handleRemove() {
    this.props.remove()
  }

  handleToggleArchive() {
    this.props.toggleArchive()
  }

  render() {
    return (
      <Menu>
        <MenuItem
          className="project-archive-item"
          onClick={ this.handleToggleArchive.bind(this) }
        >
          { this.props.project.archived ? 'Désarchiver' : 'Archiver' }
        </MenuItem>
        <MenuItem
          className="project-remove-item"
          confirm="Êtes-vous sûr de vouloir supprimer ce projet ?"
          onClick={ this.handleRemove.bind(this) }
          disabled={ this.props.isDeleting }
        >
          Supprimer
        </MenuItem>
      </Menu>
    )
  }
}

export default ProjectMenu
