import { parseTags, parseWikilinks, parseYAML } from './noteParser.js'


test('parsing tags works (and tags are sorted)', () => {
  const hashtags = parseTags('#node is an #javascript runtime built on #chrome')
  expect(hashtags).toEqual(['node', 'javascript', 'chrome'].sort())
})

test('duplicate tags are removed', () => {
  const hashtags = parseTags('#node is an #javascript runtime built on #chrome #chrome')

  expect(hashtags).toEqual(['node', 'javascript', 'chrome'].sort())
})

test('parsing wikilinks works (and they are sorted)', () => {
  const wikilinks = parseWikilinks('zettel [[note]] text can also contain [[wikilinks]]')
  // const wikilinkTitles = wikilinks.map(noteRef => noteRef.title)

  expect(wikilinks).toEqual(['note', 'wikilinks'])
})

test('parsing wikilinks works (and they are sorted)', () => {
  const wikilinks = parseWikilinks('[[note]]')
  // const wikilinkTitles = wikilinks.map(noteRef => noteRef.title)

  expect(wikilinks).toEqual(['note'])
})


test('parsing zettelId from YAML works', () => {
  const zettelId = '2021063117500000'
  const title = 'GraphQL'
  const noteText = `---\ntitle: ${title}\nzettelId: ${zettelId}\n---\n\nText body---`

  const yaml = parseYAML(noteText)

  expect(yaml.title).toBe(title)
  expect(yaml.zettelId.toString()).toBe(zettelId)
})