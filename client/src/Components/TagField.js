import { useQuery } from '@apollo/client'
import { parse } from 'graphql'
import { reduce } from 'lodash'
import ReactSelect from 'react-select/creatable'
import { ALL_TAGS } from '../query'
import useLogin from '../useLogin'
import useNote from '../useNote'

const tags = ['Apollo', 'GraphQL', 'Node']

const tagOptions = tags.map(tag => ({
  value: tag,
  label: tag
}))

const TagField = () => {

  const { isLoggedIn } = useLogin()
  console.log({ isLoggedIn })
  const { data } = useQuery(ALL_TAGS, {
    // skip: () => (!isLoggedIn)
  })
  const note = useNote()
  const noteTags = note?.tags || []

  const tags = data?.allTags
  const options = parseOptions(tags)
  const defaultTags = parseOptions(noteTags)

  console.log({ defaultTags })

  console.log({ options })

  const styles = {
    multiValue: base => ({
      ...base,
      paddingRight: '3px',
      // border: '2px dotted red',
    }),
    valueContainer: base => ({
      ...base,
      paddingTop: '6px',
      flexWrap: 'no-wrap',
      maxHeight: '38px',
      overflowX: 'hidden',
    }),
    control: base => ({
      ...base,
      // width: 200,
      maxHeight: '38px',
      alignItems: 'flex-start',
      overflowX: 'hidden',
      border: 'none'
    }),
    multiValueRemove: base => ({
      ...base,
      minWidth: '20px',
      flexShrink: 1,
      display: 'none'
    }),
    indicatorsContainer: base => ({
      ...base,
      padding: 0,
      margin: 0
    }),
    dropdownIndicator: base => ({
      ...base,
      padding: 0,
      margin: 0
    })
    // menu: base => ({ ...base, width: 200 }),
    // container: base => ({ ...base, overflowX: 'hidden' })
  }

  return (
    <ReactSelect
      placeholder={'Add tags'}
      defaultValue={defaultTags}
      isMulti
      name='tags'
      options={options}
      className='tag-field'
      isClearable={false}
      components={{
        IndicatorSeparator: () => null
      }}
      styles={styles}
    />
  )
}

const parseOptions = (tags=[]) => { 
  return tags.map(tag => ({
    value: tag.toLocaleLowerCase(),
    label: tag
  }))
 }

export default TagField