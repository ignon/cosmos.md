/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState } from "react";
import { ALL_NOTES, LATEST_NOTES } from "./query";
import { useLazyQuery } from "@apollo/client";
import ReactSelect from 'react-select/creatable'
import { escapeRegexSubstring } from './utils'
import { useEffect } from "react/cjs/react.development";
import { noteVar } from "./cache";
// import { useDebounce } from 'use-debounce/lib'


// TODO: ignoreAccents, trim
// const [searchQueryDebounced] = useDebounce(searchQuery, 500);
const SearchField = ({ fieldRef, onCreate, onSelect }) => {

  const [options, setOptions] = useState([])
  const [searchQuery, setSearchQuery] = useState('')

  const [getNotes, { data }] = useLazyQuery(ALL_NOTES, {
    fetchPolicy: 'cache-and-network'
  })
  const [findLatesNotes, { data: latestData }] = useLazyQuery(LATEST_NOTES, {
    fetchPolicy: 'cache-and-network'
  })

  const notes = data?.allNotes || []
  const latestNotes = latestData?.findLatestNotes || []

  useEffect(() => {
    const options = filterOptions(searchQuery, notes, latestNotes)
    setOptions(options)
  }, [`${[searchQuery, notes, latestNotes]}`])



  const handleSelect = ({ label, value, __isNew__: isNew }) => {
    // console.log(value, onCreate, onSelect)
    setSearchQuery('')

    if (isNew) onCreate?.(value)
    else       onSelect?.(value)
  }

  const handleInputChange = (input, { action }) => {
    if (action === 'input-change') {
      setSearchQuery(input)

      const options = filterOptions(input, notes, latestNotes)
      setOptions(options)
    }
  }




  const handleOpen = () => {
    getNotes()
    findLatesNotes()
  }


  return (
    <ReactSelect
      value={null}
      options={options}
      onMenuOpen={handleOpen}
      className='search-bar'
      inputValue={searchQuery}
      placeholder='Search or create note'
      onChange={handleSelect}
      createOptionPosition='first'
      allowCreateWhileLoading={false}
      onInputChange={handleInputChange}
      filterOption={() => true}
      formatOptionLabel={args => <NoteOption {...args} />}
      ref={fieldRef}
    />
  )
}


const parseOptionsFromNotes = (notes) => {
  return notes.map(({ title, zettelId, tags }) => ({
    label: title,
    value: zettelId,
    tags
  }))
}


const filterNotes = (input, notes, latestNotes) => {
  if (!input) { 
    return notes
  }

  const queryRE = new RegExp('^' + escapeRegexSubstring(input), 'i')
  const tagRE = new RegExp('^' + escapeRegexSubstring(input.replace('#', '')), 'i')
  const startMatch = [], inlineMatch = [], tagMatch = []

  notes.forEach(note => {
    const { title, tags=[] } = note
    const queryLength = input.length
    const titleParts = title.split(' ')

    if (queryRE.test(title)) {
      startMatch.push(note)
    }
    else if (queryLength >= 3 && titleParts.find(t => queryRE.test(t))) {
      inlineMatch.push(note)
    }
    else if (tags.find(tag => tagRE.test(tag))) {
      tagMatch.push(note)
    }
  })

  const filteredNotes = [...startMatch, ...inlineMatch, ...tagMatch]
  return filteredNotes
}

const filterOptions = (input, notes, latestNotes) => {
  if (!input) {
    const options = parseOptionsFromNotes(latestNotes)
    return options
  }
  else {
    const filteredNotes = filterNotes(input, notes)
    const options = parseOptionsFromNotes(filteredNotes)
    return options
  }

}

const NoteOption = ({ label, tags }) => {

  const tagsString = (tags || []).map(tag => `#${tag}`).join(' ')

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