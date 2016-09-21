import moment from 'moment'

import { getMoodStatus, getProjectStatus } from './model'

describe('getMoodStatus', () => {
  it('returns empty string if all the criteria are "unknown"', () => {
    const mood = {
      customer: 'unknown',
      team: 'unknown',
      money: 'unknown',
    }

    const status = getMoodStatus(mood)

    expect(status).toEqual('')
  })

  it('returns "happy" if all the criteria are "happy"', () => {
    const mood = {
      customer: 'happy',
      team: 'happy',
      money: 'happy',
    }

    const status = getMoodStatus(mood)

    expect(status).toEqual('happy')
  })

  it('returns "wtf" if all the criteria are "sad"', () => {
    const mood = {
      customer: 'sad',
      team: 'sad',
      money: 'sad',
    }

    const status = getMoodStatus(mood)

    expect(status).toEqual('wtf')
  })

  it('returns "sad" if global evalutation is bad', () => {
    const mood = {
      customer: 'so-so',
      team: 'so-so',
      money: 'sad',
    }

    const status = getMoodStatus(mood)

    expect(status).toEqual('sad')
  })

  it('returns "so-so" global evaluation is not good enough', () => {
    const mood = {
      customer: 'happy',
      team: 'happy',
      money: 'sad',
    }

    const status = getMoodStatus(mood)

    expect(status).toEqual('so-so')
  })
})

describe('getProjectStatus', () => {
  const startingDate = moment('2016-09-05').valueOf()
  const dueAtDate = moment('2016-09-16').valueOf()
  const finishedAtDate = moment('2016-09-23').valueOf()

  it('returns empty string if project has no date', () => {
    const project = {
      startedAt: 0,
      dueAt: 0,
      finishedAt: 0,
    }
    const date = moment('2016-09-10')

    const status = getProjectStatus(project, date)

    expect(status).toEqual('')
  })

  it('returns empty string if date is before starting date', () => {
    const project = {
      startedAt: moment(startingDate),
      dueAt: moment(dueAtDate),
      finishedAt: moment(finishedAtDate),
    }
    const date = moment(startingDate).subtract(1, 'week')

    const status = getProjectStatus(project, date)

    expect(status).toEqual('')
  })

  it('returns empty string if date is after ending date', () => {
    const project = {
      startedAt: moment(startingDate),
      dueAt: moment(dueAtDate),
      finishedAt: moment(finishedAtDate),
    }
    const date = moment(finishedAtDate).add(1, 'week')

    const status = getProjectStatus(project, date)

    expect(status).toEqual('')
  })

  it('returns "in-progress" if date is between starting date and end date', () => {
    const project = {
      startedAt: moment(startingDate),
      dueAt: moment(dueAtDate),
      finishedAt: moment(finishedAtDate),
    }
    const date = moment('2016-09-10')

    const status = getProjectStatus(project, date)

    expect(status).toEqual('in-progress')
  })

  it('returns "in-progress delayed" if date is between finish date and due date', () => {
    const project = {
      startedAt: moment(startingDate),
      dueAt: moment(dueAtDate),
      finishedAt: moment(finishedAtDate),
    }
    const date = moment('2016-09-20')

    const status = getProjectStatus(project, date)

    expect(status).toEqual('in-progress delayed')
  })
})
