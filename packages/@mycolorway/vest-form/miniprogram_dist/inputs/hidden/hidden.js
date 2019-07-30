"use strict";

var _input = _interopRequireDefault(require("../behaviors/input"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

Component({
  behaviors: [_input.default],
  options: {
    addGlobalClass: true
  },
  properties: {},
  data: {
    inputType: 'hidden'
  },
  methods: {}
});