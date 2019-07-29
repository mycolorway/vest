import formBehavior from '@/behavior'
import fieldsetBehavior from '@/fieldset/behavior'

export default Behavior({

  behaviors: ['wx://form-field'],

  relations: {
    'formBehavior': {
      type: 'parent',
      target: formBehavior
    },
    'fieldsetBehavior': {
      type: 'parent',
      target: fieldsetBehavior
    }
  },

  properties: {
    label: {
      type: String,
      value: ''
    },
    placeholder: {
      type: String,
      value: ''
    },
    disabled: {
      type: Boolean,
      value: false
    },
    readonly: {
      type: Boolean,
      value: false
    },
    required: {
      type: Boolean,
      value: false
    },
    error: {
      type: null,
      value: false
    },
    clearable: {
      type: Boolean,
      value: true
    }
  },

  methods: {

    getForm() {
      const fieldset = this.getFieldset()

      if (fieldset) {
        return fieldset.getForm()
      } else {
        const form = this.getRelationNodes('formBehavior')
        return form.length > 0 ? form[0] : null
      }
    },

    getFormId() {
      const form = this.getForm()
      if (!form.id) {
        throw new Error(`${this.data.inputType} input requires parent form with id.`)
      }
      return form.id
    },

    getFieldset() {
      const fieldset = this.getRelationNodes('fieldsetBehavior')
      return fieldset.length > 0 ? fieldset[0] : null
    },

    reset() {
      this.setData({ value: '' })
    },

    collectValue(formValues) {
      if (this.data.name) {
        formValues[this.data.name] = this.data.value !== undefined ? this.data.value : ''
      }
    },

    showError(error) {
      this.setData({ error })
    },

    hideError() {
      this.setData({ error: false })
    }
  }

})
