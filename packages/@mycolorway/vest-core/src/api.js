const WX = {
  _origin: wx,
  qy: {
    _origin: wx.qy
  },
  tt: {
    _origin: tt
  }
}

const wechatSyncApis = [
  // 生命周期
  'getLaunchOptionsSync',
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
  // 广告
  'createRewardedVideoAd', 'createInterstitialAd',
  // 地图、系统、画布
  'createMapContext', 'getSystemInfoSync', 'getExtConfigSync', 'createCanvasContext',
  // 调试、基础
  'getLogManager', 'canIUse',
  // 云开发
  'cloud'
]

const weworkSyncApis = []

const ttSyncApis = []

class WxCallError extends Error {
  constructor(name, res) {
    super(`wx.${name} 调用失败`)
    this.name = 'WxCallError'
    this.info = res
  }
}

function proxyAPI(from, to, excludeApis) {
  Object.keys(from).forEach(api => {
    if (/Sync$/.test(api) || excludeApis.indexOf(api) > -1) {
      to[api] = from[api]
    } else {
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
    }
  })
}

const api = (() => {
  proxyAPI(wx, WX, wechatSyncApis)
  if (wx.qy) proxyAPI(wx.qy, WX.qy, weworkSyncApis)
  if (tt) proxyAPI(tt, WX.tt, ttSyncApis)
  return WX
})()

export { api as wx, api as tt };