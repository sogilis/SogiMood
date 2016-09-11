import projects from './projects'
import notifications from './notifications'

const rootReducer = (state, action) => {
  return {
    projects: projects.reducer(state.projects, action),
    notifications: notifications.reducer(state.notifications, action),
  }
}

export default rootReducer
