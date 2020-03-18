import './utils/mock-api'
import { tt } from '@mycolorway/vest-core'

test('tt.getSystemInfo', async () => {
  const {errMsg} = await tt.getSystemInfo()
  expect(errMsg).toBe('getSystemInfo:ok')
})

test('tt.getSystemInfoSync', async () => {
  const {SDKVersion} = tt.getSystemInfoSync()
  expect(SDKVersion).toBe('2.3.0')
})
