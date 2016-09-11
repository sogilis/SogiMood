import React, { Component } from 'react'
import { Menu, MenuItem } from '../../components/Menu'

class ProjectMenu extends Component {
  handleRemove(e) {
    e.preventDefault()
    this.props.remove()
  }

  handleToggleArchive(e) {
    e.preventDefault()
    this.props.toggleArchive()
  }

  render() {
    return (
      <Menu>
        { /* <MenuItem onClick={ this.handleToggleArchive.bind(this) }>
          { this.props.project.archived ? 'Désarchiver' : 'Archiver' }
          </MenuItem> */ }
        <MenuItem
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
