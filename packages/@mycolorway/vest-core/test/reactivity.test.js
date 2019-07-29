import { observe, Watcher } from 'reactivity'

describe('watcher', () => {
  let project = null
  let projectName = null
  let callback = null

  beforeEach(() => {
    project = {
      name: {
        firstName: 'vest',
        lastName: 'core'
      },
      age: 1,
      tags: ['a', 'b']
    }
    projectName = (function() {
      return `${this.name.firstName}-${this.name.lastName}`
    }).bind(project)
    callback = jest.fn()
    observe(project)
  })

  test('normal watcher', () => {
    const watcher = new Watcher(projectName, callback)

    expect(callback).not.toBeCalled()
    expect(watcher.value).toBe('vest-core')
    project.age = 2
    expect(callback).not.toBeCalled()
    expect(watcher.value).toBe('vest-core')
    project.name.lastName = 'form'
    expect(callback).toBeCalledWith('vest-form', 'vest-core')
    expect(watcher.value).toBe('vest-form')
  })

  test('lazy watcher', () => {
    const watcher = new Watcher(projectName, callback, { lazy: true })

    expect(watcher.value).toBeUndefined()
    expect(watcher.dirty).toBe(true)
    watcher.evaluate()
    expect(watcher.value).toBe('vest-core')
    expect(watcher.dirty).toBe(false)
    project.name.lastName = 'form'
    expect(watcher.value).toBe('vest-core')
    expect(watcher.dirty).toBe(true)
    watcher.evaluate()
    expect(watcher.value).toBe('vest-form')
    expect(watcher.dirty).toBe(false)
  })

  test('deep watcher', () => {
    const watcher = new Watcher(() => project, callback, { deep: true })
    expect(callback).not.toBeCalled()
    project.age = 2
    expect(callback).toBeCalled()
    project.name.lastName = 'form'
    expect(callback.mock.calls.length).toBe(2)
  })

  test('watch array', () => {
    const watcher = new Watcher(() =>  project.tags, callback)
    expect(callback).not.toBeCalled()
    project.tags.push('c')
    expect(callback).toBeCalled()
    expect(callback.mock.calls[0][0]).toEqual(['a', 'b', 'c'])
    project.tags.splice(1, 1)
    expect(callback.mock.calls.length).toBe(2)
    expect(callback.mock.calls[1][0]).toEqual(['a', 'c'])
  })

  test('teardown', () => {
    const watcher = new Watcher(projectName, callback)
    watcher.teardown()
    project.name.lastName = 'core'
    expect(callback).not.toBeCalled()
  })
})
