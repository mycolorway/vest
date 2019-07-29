import inputBehavior from '../inputs/behaviors/input'
import formBehavior from '../behavior'
import fieldsetBehavior from './behavior'

Component({
  behaviors: [fieldsetBehavior],

  relations: {
    'inputBehavior': {
      type: 'child',
      target: inputBehavior
    },
    'formBehavior': {
      type: 'parent',
      target: formBehavior
    }
  },

  options: {
    addGlobalClass: true
  },

  properties: {
    name: String,
    label: String,
    bottomHint: String,
    withItemsInput: {
      type: Boolean,
      value: false
    }
  },

  methods: {
    getInputs() {
      return this.getRelationNodes('inputBehavior')
    },

    getForm() {
      const form = this.getRelationNodes('formBehavior')
      return form.length > 0 ? form[0] : null
    },

    getInputByName(name) {
      return this.getInputs().find(i => {
        return i.data.name === name
      })
    },

    collectValue(formValues) {
      let values = this.data.name ? formValues[this.data.name] = {} : formValues

      this.getInputs().forEach(input => {
        if (!input.data.disabled) {
          input.collectValue(values);
        }
      });
    }
  }
});
