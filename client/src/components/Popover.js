import React, { Component } from 'react'
import './Popover.css'

export default class Popover extends Component {
  constructor(props) {
    super(props)
    this.state = {
      show: false,
      target: null,
    }
  }

  setPosition(target) {
    const top = target.offsetTop + target.offsetHeight

    const middleTarget = target.offsetLeft + (target.offsetWidth / 2)
    const left = Math.max(15, middleTarget - (this.popover.offsetWidth / 2))

    this.popover.style.top = top + 'px'
    this.popover.style.left = left + 'px'
  }

  toggle(e) {
    e.preventDefault()
    this.setState({
      show: !this.state.show,
      target: e.target,
    })
  }

  render() {
    if (!this.state.show) {
      return null
    }

    return (
      <div className="popover-container">
        <a
          href="#"
          className="popover-overlay"
          onClick={ this.toggle.bind(this) }
        />
        <div
          className="popover"
          onClick={ e => e.stopPropagation() }
          ref={ ref => { this.popover = ref } }
        >
          { this.props.children }
        </div>
      </div>
    )
  }

  componentDidUpdate(prevProps, prevState) {
    if (this.state.show && prevState.show !== this.state.show) {
      this.setPosition(this.state.target)
    }
  }
}
