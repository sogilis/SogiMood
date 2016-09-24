import React, { Component } from 'react'

import './NotificationCenter.css'

class NotificationCenter extends Component {
  handleCloseNotification(e, notification) {
    e.preventDefault()
    this.props.closeNotification(notification)
  }

  notificationsNodes() {
    const { notifications } = this.props
    if (notifications.length <= 0) {
      return null
    }

    return notifications.map(notification =>
      <a
        key={ notification.id }
        href="#"
        className={ `notification notification-${ notification.status }` }
        onClick={ e => this.handleCloseNotification(e, notification) }
        data-status={ notification.status }
      >
        <div className="notification-msg">{ notification.msg }</div>
      </a>
    )
  }

  render() {
    return (
      <div className="notification-center">
        { this.notificationsNodes() }
      </div>
    )
  }
}

export default NotificationCenter
