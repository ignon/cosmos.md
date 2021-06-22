const { parseHashtags, parseWikilinks } = require('./noteParser')

test('parsing hashtags works', () => {
  const hashtags = parseHashtags('#node is an #javascript runtime built on #chrome')
  expect(hashtags).toEqual(['node', 'javascript', 'chrome'])
})

test('parsing wikilinks works', () => {
  const wikilinks = parseWikilinks('zettel [[note]] text can also contain [[wikilinks]]')
  expect(wikilinks).toEqual(['note', 'wikilinks'])
})