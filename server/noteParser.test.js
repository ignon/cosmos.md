const { parseTags, parseWikilinks } = require('./noteParser')

test('parsing tags works (and tags are sorted)', () => {
  const hashtags = parseTags('#node is an #javascript runtime built on #chrome')
  console.log(hashtags)
  expect(hashtags).toEqual(['node', 'javascript', 'chrome'].sort())
})

test('duplicate tags are removed', () => {
  const hashtags = parseTags('#node is an #javascript runtime built on #chrome #chrome')
  console.log(hashtags)
  expect(hashtags).toEqual(['node', 'javascript', 'chrome'].sort())
})

test('parsing wikilinks works (and they are sorted)', () => {
  const wikilinks = parseWikilinks('zettel [[note]] text can also contain [[wikilinks]]')
  const wikilinkTitles = wikilinks.map(noteRef => noteRef.title)

  expect(wikilinkTitles).toEqual(['note', 'wikilinks'])
})