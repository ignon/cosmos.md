import YAML from 'yaml'

const yamlRegex = /^---\n([\s\S]+)\n---/


export const parseNote = (args) => {
  let { title, text, zettelId } = args

  const tags = parseTags(text)
  const wikilinks = parseWikilinks(text)
  
  let yaml = parseYAML(text)
  const textHasYaml = (yaml)


  // If file doesn't have YAML metadata, one is created
  if (!yaml) {
    yaml = {}
  }

  // If YAML doesn't have zettelId, set it based on GraphQL query
  // YAML zettelId is just for the possible file syncing from Dropbox etc in future (so that text files are identifiable)
  // This is to avoid user from overwriting documents if they accidentally copy YAML metadata with zettelID to other text file
  // GraphQL is prioritized over YAML read from note
  if (!yaml.zettelId) {
    yaml.zettelId = zettelId
  }

  // zettelId must be sent with addNote/editNote request, either as YAML or as request parameters
  if (!zettelId && !yaml.zettelId) {
    throw new Error('zettelId must be set either in GraphQL request or in YAML metadata')
  }


  // GraphQL is prioritized over YAML read from note
  // This is to avoid users from overwriting documents if
  // they accidentally copy YAML metadata with zettelID to other text file
  // In web editor
  if (zettelId !== yaml.zettelId) {
    yaml.zettelId = zettelId
    text = text.replace()
  }

  const yamlString = YAML.stringify(yaml)
  const markdownYAML = `---\n${yamlString}---\n`

  // Note YAML metadata is updated (to overwrite zettelId and maintain indentation)
  text = (textHasYaml)
    ? text.replace(yamlRegex, markdownYAML)
    : `${markdownYAML}\n${text}`

  return {
    title,
    zettelId,
    tags,
    wikilinks,
    backlinks: [],
    text
    // yamlData: yaml
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

export const sortAndRemoveDuplicates = (list) => {
  return list
    .sort()
    .filter((item, pos, arr) => !pos || item?.toLowerCase() !== arr[pos - 1]?.toLowerCase())
}

export const parseTags = (text) => {
  const tagRegex = /#([\w_-]+)/gi

  let tags = matchGroupsGlobal(text, tagRegex, 1)
  tags = sortAndRemoveDuplicates(tags)

  return tags;
}

export const parseWikilinks = (text) => {
  const wikilinkRegex = /\[\[([\w_-]+)\]]/gi

  let wikilinkTitles = matchGroupsGlobal(text, wikilinkRegex, 1)
  wikilinkTitles = sortAndRemoveDuplicates(wikilinkTitles)
  const wikilinks = wikilinkTitles.map(title => ({ title, zettelId: null }))

  return wikilinks;
}

export const parseYAML = (text) => {
  const match = text.match(yamlRegex)

  if (!match || match.length < 2) {
    return null
  }

  const yamlText = match[1]
  const yaml = YAML.parse(yamlText)

  return yaml
}
