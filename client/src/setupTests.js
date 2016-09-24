import 'moment-range'

let storage = {}
const localStorageMock = {
  getItem: jest.fn(item => storage[item]),
  setItem: jest.fn((item, value) => storage[item] = value),
  clear: jest.fn(() => storage = {})
}
global.localStorage = localStorageMock
