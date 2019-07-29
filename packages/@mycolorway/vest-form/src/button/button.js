import formBehavior from '../behavior'

Component({

  options: {
    addGlobalClass: true
  },

  relations: {
    'formBehavior': {
      type: 'ancestor',
      target: formBehavior
    }
  },

  properties: {
    type: {
      type: String,
      value: 'primary'
    },
    loading: {
      type: Boolean,
      value: false
    },
    disabled: {
      type: Boolean,
      value: false
    }
  },

  methods: {
    onTap() {
      const form = this.getForm()
      if (form) form.submit()
    },

    getForm() {
      const form = this.getRelationNodes('formBehavior')
      return form.length > 0 ? form[0] : null
    }
  }

})
