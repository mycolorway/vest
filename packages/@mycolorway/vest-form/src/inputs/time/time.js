import InputBehavoir from '../behaviors/input'
import dateInputBehavior from '../behaviors/date'
import { DateTime } from 'luxon'
import { padString } from '@/modules/utils'

Component({
  behaviors: [InputBehavoir, dateInputBehavior],

  options: {
    addGlobalClass: true
  },

  properties: {
    minuteStep: Number,
    displayFormat: {
      type: String,
      value: 'HH : mm'
    },
    showEmptyOption: {
      type: Boolean,
      value: false
    }
  },

  data: {
    inputType: 'time',
    range: [],
    index: [],
    displayValue: null
  },

  attached() {
    this._initCurrentTime()
    this._initRangeItems({ noMinutes: !this.currentTime })

    const value = this.currentTime ? this.format(this.currentTime, 'HH:mm:ss') : this.data.value
    this.setData({
      range: this.rangeItems,
      value: value,
      index: this._getIndex()
    })
  },

  methods: {
    onChange(e) {
      if (this.rangeItems[1][0] === '') {
        this.setData({ value: null })
      } else {
        this.currentTime = this._getDateByIndex(e.detail.value)
        this.setData({
          index: e.detail.value,
          value: this.format(this.currentTime, 'HH:mm:ss')
        })
      }

      this.triggerEvent('change', {
        name: this.data.name, value: this.data.value
      }, { bubbles: true })
    },

    onReset() {
      this.reset()
      this.triggerEvent('change', {
        name: this.data.name, value: this.data.value
      }, { bubbles: true })
    },

    onColumnChange(e) {
      if (!this.properties.showEmptyOption) return

      if (e.detail.column === 0 && e.detail.value === 0) {
        this._initRangeItems({ noMinutes: true })
        this.setData({ range: this.rangeItems })
      } else if (this.rangeItems[1][0] === ''){
        this._initRangeItems()
        this.setData({ range: this.rangeItems })
      }
    },

    _initCurrentTime() {
      const defaultDate = this.data.showEmptyOption ? null : DateTime.local().set({ second: 0 })
      this.currentTime = this.data.value ? DateTime.fromISO(this.data.value) : defaultDate
    },

    _initRangeItems({ noMinutes = false } = {}) {
      let hours = this.range(0, 24).map(h => this._padItem(h, { unit: '时' }))
      if (this.properties.showEmptyOption) {
        hours = ['空'].concat(hours)
      }

      let minutes = ['']
      if (!noMinutes) {
        minutes = this.range(
          0, 60, this.properties.minuteStep || 1
        ).map(m => this._padItem(m, { unit: '分' }))
      }

      this.rangeItems = [hours, minutes]
    },

    _getDateByIndex(index) {
      let [hour, minute] = index.map((value, idx) => parseInt(this.rangeItems[idx][value], 10))
      return DateTime.local().set({ hour, minute, second: 0 })
    },

    _getIndex() {
      if (!this.currentTime) {
        return [0, 0]
      }

      let items = [this.currentTime.hour, this.currentTime.minute]

      return items.map((value, index) => {
        return this.rangeItems[index]
          .findIndex(item => parseInt(item, 10) === value)
      })
    },

    _padItem(item, opts = { unit: null }) {
      item = padString(item.toString(), 2, '0');
      return opts.unit ? item + opts.unit : item;
    },
  }
})
