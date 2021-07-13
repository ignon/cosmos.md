import { makeVar, InMemoryCache, defaultDataIdFromObject } from '@apollo/client'

export const zettelIdVar = makeVar()
export const editorVar = makeVar()
export const noteVar = makeVar()
zettelIdVar(null)
noteVar(null)

const cache = new InMemoryCache({
  dataIdFromObject(obj) {
    const type = obj.__typename
    switch(type) {
      case 'Note': return `Note:${obj.zettelId}`;
      default: return defaultDataIdFromObject(obj)
    }
  }
})

export default cache