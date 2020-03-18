import './utils/mock-api'

test('tt.getSystemInfoSync', () => {
  const {SDKVersion} = wx.getSystemInfoSync()
  expect(SDKVersion).toBe('2.3.0')
})
