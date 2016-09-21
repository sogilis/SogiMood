import moment from 'moment'

const DATE_FORMAT = 'DD MMM YYYY'

export function getWeekLabel(date) {
  return 'semaine ' + date.week() + ' - du ' + date.startOf('week').format(DATE_FORMAT) + ' au ' + date.endOf('week').format(DATE_FORMAT)
}

export function isCurrentWeek(date) {
  return date.week() === moment().week()
}

function getMoodValue(mood) {
  if (mood === 'happy') return 1
  if (mood === 'sad') return -1
  return 0
}

export function getMoodStatus(mood) {
  const { customer, team, money } = mood

  if (customer === 'unknown' && team === 'unknown' && money === 'unknown') {
    return ''
  }

  const customerValue = getMoodValue(customer)
  const teamValue = getMoodValue(team)
  const moneyValue = getMoodValue(money)
  const globalValue = customerValue + teamValue + moneyValue

  if (globalValue >= 2) return 'happy'
  if (globalValue <= -3) return 'wtf'
  if (globalValue <= -1) return 'sad'
  return 'so-so'
}

function isProjectInProgress(project, date) {
  const endAt = Math.max(project.dueAt, project.finishedAt)
  if (!project.startedAt || !endAt) {
    return false
  }

  const startDate = moment(project.startedAt)
  const endDate = moment(endAt)
  return date.isBetween(startDate.startOf('week'), endDate.endOf('week'), null, '[]')
}

function isProjectDelayed(project, date) {
  if (!project.startedAt || project.dueAt >= project.finishedAt) {
    return false
  }

  const dueDate = moment(project.dueAt)
  const finishDate = moment(project.finishedAt)
  return date.isBetween(dueDate.startOf('week'), finishDate.endOf('week'), null, '[]')
}

export function getProjectStatus(project, date) {
  const res = (isProjectInProgress(project, date) ? 'in-progress' : '') + (isProjectDelayed(project, date) ? ' delayed' : '')
  return res
}
