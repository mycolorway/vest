const WX = {
  _origin: wx,
  qy: {
    _origin: wx.qy
  }
}

const wechatSyncApis = [
  // 网络
  'downloadFile', 'connectSocket', 'onSocketOpen', 'onSocketClose', 'onSocketMessage',
  'onSocketError', 'uploadFile',
  // 媒体
  'createAudioContext', 'createInnerAudioContext', 'createCameraContext',
  'createLivePusherContext', 'createLivePlayerContext', 'createVideoContext',
  'onBackgroundAudioStop', 'getBackgroundAudioManager', 'onBackgroundAudioPlay',
  'onBackgroundAudioPause', 'getRecorderManager',
  // 文件
  'getFileSystemManager',
  // 数据缓存
  'getStorageSync', 'setStorageSync', 'removeStorageSync', 'clearStorageSync',
  'getStorageInfoSync',
  // 设备
  'onNetworkStatusChange', 'onAccelerometerChange', 'onCompassChange', 'onGyroscopeChange',
  'onBeaconUpdate', 'onBeaconServiceChange', 'onDeviceMotionChange', 'getBatteryInfoSync',
  'onMemoryWarning', 'onBLECharacteristicValueChange', 'onBLEConnectionStateChange',
  'onBluetoothAdapterStateChange', 'onBluetoothDeviceFound', 'onHCEMessage',
  'onUserCaptureScreen', 'onGetWifiList', 'onWifiConnected',
  // 界面
  'nextTick', 'getMenuButtonBoundingClientRect', 'createAnimation', 'onWindowResize',
  'offWindowResize',
  // 开放接口
  'getAccountInfoSync', 'reportAnalytics',
  // 更新、Worker、数据上报
  'getUpdateManager', 'createWorker', 'reportMonitor',
  // WXML
  'createIntersectionObserver', 'createSelectorQuery',
  // 地图、系统、画布
  'createMapContext', 'getSystemInfoSync', 'getExtConfigSync', 'createCanvasContext',
  // 调试、基础
  'getLogManager', 'canIUse'
]

const weworkSyncApis = []

class WxCallError extends Error {
  constructor(name, res) {
    super(`wx.${name} 调用失败`)
    this.name = 'WxCallError'
    this.info = res
  }
}

function proxyAPI (from, to, excludeApis) {
  Object.keys(from).forEach(api => {
    if (excludeApis.indexOf(api) === -1) {
      to[api] = (options = {}, ...otherArgs) => new Promise((resolve, reject) => {
        from[api](Object.assign(options, {
          success(...args) {
            resolve(...args)
          },
          fail(res) {
            reject(new WxCallError(api, res))
          }
        }), ...otherArgs)
      })
    } else {
      to[api] = from[api]
    }
  })
}

export default (() => {
  proxyAPI(wx, WX, wechatSyncApis)
  if (wx.qy) proxyAPI(wx.qy, WX.qy, weworkSyncApis)
  return WX
})()
