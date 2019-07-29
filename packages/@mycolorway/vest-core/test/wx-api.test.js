import './utils/mock-api'
import wx from '../src/wx-api'

test('sync api', () => {
  const systemInfo = wx.getSystemInfoSync()
  expect(systemInfo).toHaveProperty('platform')
})

test('async api', async () => {
  try {
    const systemInfo = await wx.getSystemInfo()
    expect(systemInfo).toHaveProperty('platform')
  } catch (e) {
    expect(e).toHaveProperty('info')
  }
})
