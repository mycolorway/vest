import {patchBehaviors} from './behaviors/utils'

export default function (config) {
  return {
    id: Behavior(patchBehaviors(config)),
    config,
    _vest: true
  }
}
