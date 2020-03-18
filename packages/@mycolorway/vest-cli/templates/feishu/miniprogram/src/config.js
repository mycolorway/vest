// put global config here
const systemInfo = tt.getSystemInfoSync()
const isIPhoneX = systemInfo.model.indexOf('iPhone X') >= 0 || systemInfo.model.indexOf('iPhone11') >= 0

export {
  systemInfo, isIPhoneX
}
