import { build, sortByEndDate } from './model'

describe('sortByEndDate', () => {
  it('sorts projects with the nearest finishedAt date first', () => {
    const projects = [
      build({ name: 'Project A', finishedAt: 1100 }),
      build({ name: 'Project B', finishedAt: 1200 }),
      build({ name: 'Project C', finishedAt: 1000 }),
    ]

    const sortedProjects = sortByEndDate(projects)

    expect(sortedProjects[0].name).toBe('Project C')
    expect(sortedProjects[1].name).toBe('Project A')
    expect(sortedProjects[2].name).toBe('Project B')
  })

  it('sorts projects with the nearest dueAt date first then', () => {
    const projects = [
      build({ name: 'Project A', dueAt: 1100                   }),
      build({ name: 'Project B', dueAt: 1000, finishedAt: 1200 }),
      build({ name: 'Project C',              finishedAt: 1000 }),
    ]

    const sortedProjects = sortByEndDate(projects)

    expect(sortedProjects[0].name).toBe('Project C')
    expect(sortedProjects[1].name).toBe('Project A')
    expect(sortedProjects[2].name).toBe('Project B')
  })

  it('sorts projects by name if end dates are the same', () => {
    const projects = [
      build({ name: 'Project B', finishedAt: 1000 }),
      build({ name: 'Project C', finishedAt: 1000 }),
      build({ name: 'Project A', finishedAt: 1000 }),
    ]

    const sortedProjects = sortByEndDate(projects)

    expect(sortedProjects[0].name).toBe('Project A')
    expect(sortedProjects[1].name).toBe('Project B')
    expect(sortedProjects[2].name).toBe('Project C')
  })

  it('sorts projects with no end date at the end', () => {
    const projects = [
      build({ name: 'Project A' }),
      build({ name: 'Project B', finishedAt: 1200 }),
      build({ name: 'Project C' }),
    ]

    const sortedProjects = sortByEndDate(projects)

    expect(sortedProjects[0].name).toBe('Project B')
    expect(sortedProjects[1].name).toBe('Project A')
    expect(sortedProjects[2].name).toBe('Project C')
  })
})
