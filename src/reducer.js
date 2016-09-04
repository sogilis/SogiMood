import projects from './projects'

const rootReducer = (state, action) => {
  return {
    projects: projects.reducer(state.projects, action)
  }
}

export default rootReducer
