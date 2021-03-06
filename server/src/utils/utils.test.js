import { getZettelId } from './utils.js'


test('getZettelId works', () => {
  const date = new Date('1988-03-31T00:00')
  const dateStr = date.toString()
  const zettelId = getZettelId(dateStr)

  expect(zettelId).toBe('19880331000000')
})

export default {}