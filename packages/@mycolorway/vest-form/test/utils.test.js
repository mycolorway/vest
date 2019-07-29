import { padString } from 'modules/utils'

test('padString', () => {
  expect(padString('123456', 4, '0')).toBe('123456')
  expect(padString('99', 4, '0')).toBe('0099')
})
