"use strict";

var _input = _interopRequireDefault(require("../behaviors/input"));

var _date = _interopRequireDefault(require("../behaviors/date"));

var _luxon = require("luxon");

var _utils = require("../../modules/utils");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance"); }

function _iterableToArrayLimit(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

Component({
  behaviors: [_input.default, _date.default],
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
  attached: function attached() {
    this._initCurrentTime();

    this._initRangeItems({
      noMinutes: !this.currentTime
    });

    var value = this.currentTime ? this.format(this.currentTime, 'HH:mm:ss') : this.data.value;
    this.setData({
      range: this.rangeItems,
      value: value,
      index: this._getIndex()
    });
  },
  methods: {
    onChange: function onChange(e) {
      if (this.rangeItems[1][0] === '') {
        this.setData({
          value: null
        });
      } else {
        this.currentTime = this._getDateByIndex(e.detail.value);
        this.setData({
          index: e.detail.value,
          value: this.format(this.currentTime, 'HH:mm:ss')
        });
      }

      this.triggerEvent('change', {
        name: this.data.name,
        value: this.data.value
      }, {
        bubbles: true
      });
    },
    onReset: function onReset() {
      this.reset();
      this.triggerEvent('change', {
        name: this.data.name,
        value: this.data.value
      }, {
        bubbles: true
      });
    },
    onColumnChange: function onColumnChange(e) {
      if (!this.properties.showEmptyOption) return;

      if (e.detail.column === 0 && e.detail.value === 0) {
        this._initRangeItems({
          noMinutes: true
        });

        this.setData({
          range: this.rangeItems
        });
      } else if (this.rangeItems[1][0] === '') {
        this._initRangeItems();

        this.setData({
          range: this.rangeItems
        });
      }
    },
    _initCurrentTime: function _initCurrentTime() {
      var defaultDate = this.data.showEmptyOption ? null : _luxon.DateTime.local().set({
        second: 0
      });
      this.currentTime = this.data.value ? _luxon.DateTime.fromISO(this.data.value) : defaultDate;
    },
    _initRangeItems: function _initRangeItems() {
      var _this = this;

      var _ref = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
          _ref$noMinutes = _ref.noMinutes,
          noMinutes = _ref$noMinutes === void 0 ? false : _ref$noMinutes;

      var hours = this.range(0, 24).map(function (h) {
        return _this._padItem(h, {
          unit: '时'
        });
      });

      if (this.properties.showEmptyOption) {
        hours = ['空'].concat(hours);
      }

      var minutes = [''];

      if (!noMinutes) {
        minutes = this.range(0, 60, this.properties.minuteStep || 1).map(function (m) {
          return _this._padItem(m, {
            unit: '分'
          });
        });
      }

      this.rangeItems = [hours, minutes];
    },
    _getDateByIndex: function _getDateByIndex(index) {
      var _this2 = this;

      var _index$map = index.map(function (value, idx) {
        return parseInt(_this2.rangeItems[idx][value], 10);
      }),
          _index$map2 = _slicedToArray(_index$map, 2),
          hour = _index$map2[0],
          minute = _index$map2[1];

      return _luxon.DateTime.local().set({
        hour: hour,
        minute: minute,
        second: 0
      });
    },
    _getIndex: function _getIndex() {
      var _this3 = this;

      if (!this.currentTime) {
        return [0, 0];
      }

      var items = [this.currentTime.hour, this.currentTime.minute];
      return items.map(function (value, index) {
        return _this3.rangeItems[index].findIndex(function (item) {
          return parseInt(item, 10) === value;
        });
      });
    },
    _padItem: function _padItem(item) {
      var opts = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {
        unit: null
      };
      item = (0, _utils.padString)(item.toString(), 2, '0');
      return opts.unit ? item + opts.unit : item;
    }
  }
});