// put global config here
const systemInfo = wx.getSystemInfoSync()
const isWXWork = systemInfo.environment == 'wxwork'
const isIPhoneX = systemInfo.model.indexOf('iPhone X') >= 0 || systemInfo.model.indexOf('iPhone11') >= 0

export {
  systemInfo, isWXWork, isIPhoneX
}
