import './utils/mock-api'
import {wx} from 'vest-pocket'

test('wx.getSystemInfo', async () => {
  const {errMsg} = await wx.getSystemInfo()
  expect(errMsg).toBe('getSystemInfo:ok')
})

test('wx.getSystemInfoSync', async () => {
  const {SDKVersion} = wx.getSystemInfoSync()
  expect(SDKVersion).toBe('2.3.0')
})
