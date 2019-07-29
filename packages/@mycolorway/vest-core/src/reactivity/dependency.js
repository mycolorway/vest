import { uniqueId, removeFromArray } from '../utils'

export default class Dependency {

  constructor () {
    this.id = uniqueId()
    this.subscribers = []
  }

  addSubscriber(subscriber) {
    this.subscribers.push(subscriber)
  }

  removeSubscriber(subscriber) {
    removeFromArray(this.subscribers, subscriber)
  }

  depend() {
    if (Dependency.target) {
      Dependency.target.addDependency(this)
    }
  }

  notify() {
    this.subscribers.slice().forEach(subscriber => {
      subscriber.update()
    })
  }

}

Dependency.target = null

const targetStack = []

export function pushTarget(target) {
  if (Dependency.target) targetStack.push(Dependency.target)
  Dependency.target = target
}

export function popTarget() {
  Dependency.target = targetStack.pop()
}
