import Store from './Store'

it('calls reducer on dispatch', () => {
  let spy = null
  const reducer = (state, action) => {
    spy = action
  }
  const action = { type: 'ADD_PROJECT' }
  const store = new Store(reducer)

  store.dispatch(action)

  expect(spy).toBe(action)
})

it('sends new state to listeners on dispatch', () => {
  let spy = null
  const listener = state => {
    spy = state
  }
  const reducer = (state, action) => {
    return action.value
  }
  const store = new Store(reducer)
  const action = { value: 42 }

  store.subscribe(listener)
  store.dispatch(action)

  expect(spy).toEqual(42)
})

it('executes action if it is a function', () => {
  let spy = null
  const store = new Store()
  const action = (dispatch, getState, options) => {
    spy = {
      dispatch,
      state: getState(),
      options,
    }
  }

  store.dispatch(action)

  expect(typeof spy.dispatch).toBeTruthy()
  expect(spy.state).toEqual({})
  expect(spy.options['ENDPOINT']).toBeDefined()
  expect(spy.options['TOKEN']).toBeDefined()
})
