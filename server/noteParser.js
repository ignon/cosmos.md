const parseNote = (args) => {
  const { title, text, zettelId } = args

  const hashtags = parseHashtags(text)
  const wikilinks = parseWikilinks(text)

  console.log('HASHTAGS: ', hashtags, '\nWIKILINKS: ', wikilinks)

  return {
    ...args,
    hashtags,
    wikilinks
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

const parseHashtags = (text) => {
  const hashtagRegex = /#([\w_-]+)/gi

  const hashtags = matchGroupsGlobal(text, hashtagRegex, 1)
  return hashtags;
}

const parseWikilinks = (text) => {
  const wikilinkRegex = /\[\[([\w_-]+)\]]/gi

  const wikilinks = matchGroupsGlobal(text, wikilinkRegex, 1)
  return wikilinks;
}

module.exports = {
  parseHashtags,
  parseWikilinks
}