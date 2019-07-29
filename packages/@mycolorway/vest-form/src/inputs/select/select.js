import inputBehavior from '../behaviors/input'

Component({
  behaviors: [inputBehavior],

  options: {
    addGlobalClass: true
  },

  properties: {
    value: {
      type: null,
      observer: '_updateDisplay'
    },
    collection: {
      type: Array,
      value: [],
      observer: '_updateDisplay'
    }
  },

  data: {
    inputType: 'select',
    index: null,
    range: [],
    selectedItems: []
  },

  attached() {
  },

  methods: {
    onChange(e) {
      this.setData({
        index: e.detail.value,
        value: this._getValueByIndex(e.detail.value)
      }, () => {
        this.triggerEvent('change', {
          name: this.data.name,
          value: this.data.value
        }, { bubbles: true })
      })
    },

    onReset() {
      this.reset()
      this.triggerEvent('change', {
        name: this.data.name,
        value: this.data.value
      }, { bubbles: true })
    },

    _updateDisplay() {
      this.setData({
        range: this._convertCollectionToRange(),
        index: this._getIndexByValue(this.properties.value)
      })
    },

    _getIndexByValue(value) {
      let index = this.properties.collection.findIndex((element) => {
        return this._normalizeElement(element).id == value
      })
      return index === -1 ? null : index
    },

    _getValueByIndex(index) {
      if (index == -1) return null
      return this._normalizeElement(this.properties.collection[index]).id
    },

    _convertCollectionToRange() {
      return this.properties.collection.map((element) => {
        return this._normalizeElement(element)
      })
    },

    _normalizeElement(element) {
      if (element instanceof Array) {
        return {id: element[1], name: element[0]}
      } else if(typeof element === 'object') {
        return element
      } else {
        return {id: element, name: element}
      }
    },

    collectValue(formValues) {
      if (this.data.name) {
        formValues[this.data.name] = this.data.value
      }
    }
  }
})
