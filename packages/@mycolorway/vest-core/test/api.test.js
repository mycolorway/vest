import './utils/mock-api'
import { tt } from '../src/api'

test('sync api', () => {
  const systemInfo = tt.getSystemInfoSync()
  expect(systemInfo).toHaveProperty('platform')
})

test('async api', async () => {
  try {
    const systemInfo = await tt.getSystemInfo()
    expect(systemInfo).toHaveProperty('platform')
  } catch (e) {
    expect(e).toHaveProperty('info')
  }
})
