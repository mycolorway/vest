import './utils/mock-api'

test('wx.getSystemInfoSync', () => {
  const {SDKVersion} = wx.getSystemInfoSync()
  expect(SDKVersion).toBe('2.3.0')
})
