import React, { useState, useEffect } from 'react'
import { SEARCH_NOTES } from '../query'
import { useApolloClient, useLazyQuery } from '@apollo/client'
import ReactSelect from 'react-select/creatable'


const SearchField = ({ fieldRef, onCreate, onSelect }) => {

  const [options, setOptions] = useState([])
  const [searchQuery, setSearchQuery] = useState('')

  const [searchNotes, { data }] = useLazyQuery(SEARCH_NOTES, {
    fetchPolicy: 'network-only',
    variables: {
      input: searchQuery
    }
  })

  const apollo = useApolloClient()
  const notes = data?.searchNotes || []

  console.log({ searchQuery, data, cache: apollo.cache })
  console.log({ notes })

  useEffect(() => {
    const options = parseOptionsFromNotes(notes)
    setOptions(options)
  }, [`${[searchQuery, notes]}`])



  const handleSearchSelect = ({ value, __isNew__: isNew }) => {
    setSearchQuery('')

    if (isNew) onCreate?.(value)
    else       onSelect?.(value)
  }

  const handleSearchInputChange = (input, { action }) => {
    if (action === 'input-change') {
      const options = parseOptionsFromNotes(notes)
      setOptions(options)
      setSearchQuery(input)
    }
  }


  const handleSearchOpen = () => {
    searchNotes('')
  }

  const style = {
    control: base => ({
      ...base,
      border: 'none',
      fontSize: '16.5px',
    })
  }

  return (
    <ReactSelect
      value={null}
      options={options}
      onMenuOpen={handleSearchOpen}
      className='search-bar'
      inputValue={searchQuery}
      placeholder='Search or create note'
      onChange={handleSearchSelect}
      createOptionPosition='first'
      allowCreateWhileLoading={false}
      onInputChange={handleSearchInputChange}
      filterOption={() => true}
      formatOptionLabel={args => <NoteOption {...args} />}
      components={{ IndicatorSeparator: () => null, DropdownIndicator: () => null }}
      ref={fieldRef}
      styles={style}
    />
  )
}


const parseOptionsFromNotes = (notes) => {
  return notes.map(({ title, tags }) => ({
    label: title,
    value: title,
    tags
  }))
}


// const filterNotes = (input, notes) => {
//   if (!input) { 
//     return notes
//   }

//   const queryRE = new RegExp('^' + escapeRegexSubstring(input), 'i')
//   const tagRE = new RegExp('^' + escapeRegexSubstring(input.replace('#', '')), 'i')
//   const startMatch = [], inlineMatch = [], tagMatch = []

//   notes.forEach(note => {
//     const { title, tags=[] } = note
//     const queryLength = input.length
//     const titleParts = title.split(' ')

//     if (queryRE.test(title)) {
//       startMatch.push(note)
//     }
//     else if (queryLength >= 3 && titleParts.find(t => queryRE.test(t))) {
//       inlineMatch.push(note)
//     }
//     else if (tags.find(tag => tagRE.test(tag))) {
//       tagMatch.push(note)
//     }
//   })

//   const filteredNotes = [...startMatch, ...inlineMatch, ...tagMatch]
//   return filteredNotes
// }

const NoteOption = ({ label, tags }) => {

  const tagsString = (tags || []).map(tag => `#${tag}`).join(' ')

  return (
    <div className='search-option-container' style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'flex-start'
    }}>
      <div style={{marginLeft: '0px'}}>{label}</div>
      <div className='search-bar-tags' style={{ flexGrow: 0, marginTop: '2px'  }}>{tagsString}</div>
    </div>
  )
}

export default SearchField