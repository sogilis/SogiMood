export function listNotifications(state) {
  return Object.keys(state.notifications).map(id => state.notifications[id])
}
