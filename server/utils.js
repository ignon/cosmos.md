const dateFormat = require('dateformat')


const getZettelId = (dateString=null) => {
  const date = (dateString)
    ? new Date(dateString)
    : new Date()

  const format = 'yyyy-mm-dd-HH-MM-ss'
  const zettelId = dateFormat(date, format).replace(/-/g, '')

  return zettelId
}

module.exports = { getZettelId }