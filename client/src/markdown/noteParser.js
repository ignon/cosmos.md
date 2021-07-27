const parseNote = (note) => {
  let { title, zettelId, text } = note

  const tags = parseTags(text)
  const wikilinks = parseWikilinks(text)
  
  return {
    title,
    zettelId,
    tags,
    wikilinks,
    text,
  }
}

const matchGroupsGlobal = (text, regex, groupIndex) => {
  const output = []
  
  let matches = regex.exec(text)
  while (matches) {
    output.push(matches[groupIndex])
    matches = regex.exec(text)
  }

  return output
}

const sortAndRemoveDuplicates = (list) => {
  return list
    .sort()
    .filter((item, pos, arr) => !pos || item?.toLowerCase() !== arr[pos - 1]?.toLowerCase())
}

const parseTags = (text) => {
  const tagRegex = /#([\w_-]+)/gi

  let tags = matchGroupsGlobal(text, tagRegex, 1)
  tags = sortAndRemoveDuplicates(tags)

  return tags
}

const parseWikilinks = (text) => {
  const wikilinkRegex = /\[\[([\w_-]+)\]]/gi

  let wikilinkTitles = matchGroupsGlobal(text, wikilinkRegex, 1)
  wikilinkTitles = sortAndRemoveDuplicates(wikilinkTitles)

  return wikilinkTitles
}

export default parseNote