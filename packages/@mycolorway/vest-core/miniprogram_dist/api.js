"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.tt = exports.wx = void 0;

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = _getPrototypeOf(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = _getPrototypeOf(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return _possibleConstructorReturn(this, result); }; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _wrapNativeSuper(Class) { var _cache = typeof Map === "function" ? new Map() : undefined; _wrapNativeSuper = function _wrapNativeSuper(Class) { if (Class === null || !_isNativeFunction(Class)) return Class; if (typeof Class !== "function") { throw new TypeError("Super expression must either be null or a function"); } if (typeof _cache !== "undefined") { if (_cache.has(Class)) return _cache.get(Class); _cache.set(Class, Wrapper); } function Wrapper() { return _construct(Class, arguments, _getPrototypeOf(this).constructor); } Wrapper.prototype = Object.create(Class.prototype, { constructor: { value: Wrapper, enumerable: false, writable: true, configurable: true } }); return _setPrototypeOf(Wrapper, Class); }; return _wrapNativeSuper(Class); }

function _construct(Parent, args, Class) { if (_isNativeReflectConstruct()) { _construct = Reflect.construct; } else { _construct = function _construct(Parent, args, Class) { var a = [null]; a.push.apply(a, args); var Constructor = Function.bind.apply(Parent, a); var instance = new Constructor(); if (Class) _setPrototypeOf(instance, Class.prototype); return instance; }; } return _construct.apply(null, arguments); }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Date.prototype.toString.call(Reflect.construct(Date, [], function () {})); return true; } catch (e) { return false; } }

function _isNativeFunction(fn) { return Function.toString.call(fn).indexOf("[native code]") !== -1; }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

var WX = {
  _origin: wx,
  qy: {
    _origin: wx.qy
  }
};
var wechatSyncApis = [// 生命周期
'getLaunchOptionsSync', // 网络
'downloadFile', 'connectSocket', 'onSocketOpen', 'onSocketClose', 'onSocketMessage', 'onSocketError', 'uploadFile', // 媒体
'createAudioContext', 'createInnerAudioContext', 'createCameraContext', 'createLivePusherContext', 'createLivePlayerContext', 'createVideoContext', 'onBackgroundAudioStop', 'getBackgroundAudioManager', 'onBackgroundAudioPlay', 'onBackgroundAudioPause', 'getRecorderManager', // 文件
'getFileSystemManager', // 数据缓存
'getStorageSync', 'setStorageSync', 'removeStorageSync', 'clearStorageSync', 'getStorageInfoSync', // 设备
'onNetworkStatusChange', 'onAccelerometerChange', 'onCompassChange', 'onGyroscopeChange', 'onBeaconUpdate', 'onBeaconServiceChange', 'onDeviceMotionChange', 'getBatteryInfoSync', 'onMemoryWarning', 'onBLECharacteristicValueChange', 'onBLEConnectionStateChange', 'onBluetoothAdapterStateChange', 'onBluetoothDeviceFound', 'onHCEMessage', 'onUserCaptureScreen', 'onGetWifiList', 'onWifiConnected', // 界面
'nextTick', 'getMenuButtonBoundingClientRect', 'createAnimation', 'onWindowResize', 'offWindowResize', // 开放接口
'getAccountInfoSync', 'reportAnalytics', // 更新、Worker、数据上报
'getUpdateManager', 'createWorker', 'reportMonitor', // WXML
'createIntersectionObserver', 'createSelectorQuery', // 广告
'createRewardedVideoAd', 'createInterstitialAd', // 地图、系统、画布
'createMapContext', 'getSystemInfoSync', 'getExtConfigSync', 'createCanvasContext', // 调试、基础
'getLogManager', 'canIUse', // 云开发
'cloud'];
var weworkSyncApis = [];

var WxCallError = /*#__PURE__*/function (_Error) {
  _inherits(WxCallError, _Error);

  var _super = _createSuper(WxCallError);

  function WxCallError(name, res) {
    var _this;

    _classCallCheck(this, WxCallError);

    _this = _super.call(this, "wx.".concat(name, " \u8C03\u7528\u5931\u8D25"));
    _this.name = 'WxCallError';
    _this.info = res;
    return _this;
  }

  return WxCallError;
}( /*#__PURE__*/_wrapNativeSuper(Error));

function proxyAPI(from, to, excludeApis) {
  Object.keys(from).forEach(function (api) {
    if (/Sync$/.test(api) || excludeApis.indexOf(api) > -1) {
      to[api] = from[api];
    } else {
      to[api] = function () {
        var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

        for (var _len = arguments.length, otherArgs = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
          otherArgs[_key - 1] = arguments[_key];
        }

        return new Promise(function (resolve, reject) {
          from[api].apply(from, [Object.assign(options, {
            success: function success() {
              resolve.apply(void 0, arguments);
            },
            fail: function fail(res) {
              reject(new WxCallError(api, res));
            }
          })].concat(otherArgs));
        });
      };
    }
  });
}

var api = function () {
  proxyAPI(wx, WX, wechatSyncApis);
  if (wx.qy) proxyAPI(wx.qy, WX.qy, weworkSyncApis);
  return WX;
}();

exports.tt = exports.wx = api;