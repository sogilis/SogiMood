const ENDPOINT = localStorage.getItem('endpoint') || '/api'
const TOKEN = localStorage.getItem('token') || ''

class Store {
  constructor(reducer = null) {
    this.reducer = reducer != null ? reducer : state => state
    this.state = {}
    this.listeners = []

    this.dispatch({
      type: 'store/INIT',
    })
  }

  subscribe(listener) {
    this.listeners.push(listener)
  }

  dispatch(action) {
    if (typeof action === 'function') {
      return action(
        this.dispatch.bind(this),
        this.getState.bind(this),
        { ENDPOINT, TOKEN }
      )
    }

    this.state = this.reducer(this.state, action)

    this.listeners.forEach(listener => listener(this.state))

    return action
  }

  getState() {
    return this.state
  }
}

export default Store
