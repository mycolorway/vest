import inputBehavior from '../behaviors/input'

Component({
  behaviors: [inputBehavior],

  options: {
    addGlobalClass: true
  },

  properties: {
    switch: {
      type: Boolean,
      value: true
    },
    value: {
      type: Boolean
    },
    badgeText: {
      type: String
    },
    badgeColor: {
      type: String
    }
  },

  data: {
    inputType: 'boolean'
  },

  methods: {
    onChange(e) {
      this.setData({ value: e.detail.value });
      this.triggerEvent('change', {
        name: this.data.name,
        value: e.detail.value
      }, { bubbles: true });
    }
  }
});
