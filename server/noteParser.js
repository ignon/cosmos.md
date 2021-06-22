const parseNote = (args) => {
  const { title, text, zettelId } = args

  const tags = parseTags(text)
  const wikilinks = parseWikilinks(text)


  return {
    title,
    zettelId,
    tags,
    wikilinks,
    backlinks: [],
    text,
  }
}

const matchGroupsGlobal = (text, regex, groupIndex) => {
  let matches
  const output = []
  
  while (matches = regex.exec(text)) {
    output.push(matches[groupIndex])
  }

  return output
}

const sortAndRemoveDuplicates = (list) => {
  return list
    .sort()
    .filter((item, pos, arr) => !pos || item !== arr[pos - 1])
}

const parseTags = (text) => {
  const hashtagRegex = /#([\w_-]+)/gi

  const hashtags = matchGroupsGlobal(text, hashtagRegex, 1)
  const tags = sortAndRemoveDuplicates(hashtags)

  console.log('tags', tags)
  return tags;
}

const parseWikilinks = (text) => {
  const wikilinkRegex = /\[\[([\w_-]+)\]]/gi

  let wikilinkTitles = matchGroupsGlobal(text, wikilinkRegex, 1)
  wikilinkTitles = sortAndRemoveDuplicates(wikilinkTitles)
  const wikilinks = wikilinkTitles.map(title => ({ title, zettelId: null }))

  return wikilinks;
}

module.exports = {
  parseNote,
  parseTags,
  parseWikilinks
}