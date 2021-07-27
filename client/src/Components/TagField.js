import { useQuery } from '@apollo/client'
import ReactSelect from 'react-select/creatable'
import { ALL_TAGS } from '../query'
import useLogin from '../useLogin'
import useNote from '../useNote'
import { useMediaQuery } from '@react-hook/media-query'


const TagField = () => {

  const { isLoggedIn } = useLogin()
  console.log({ isLoggedIn })
  const { data } = useQuery(ALL_TAGS)
  const note = useNote()
  const noteTags = note?.tags || []

  const tags = data?.allTags
  const options = parseOptions(tags)
  const defaultTags = parseOptions(noteTags)


  const minimized = useMediaQuery('(max-width: 600px)')
  if (minimized) {
    return null
  }


  const styles = {
    multiValue: base => ({
      ...base,
      paddingRight: '3px',
    }),
    valueContainer: base => ({
      ...base,
      paddingTop: '10px',
      flexWrap: 'no-wrap',
      maxHeight: '38px',
      overflowX: 'hidden',
      fontSize: '15px'
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
      margin: 0,
      marginTop: '2px'
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
      components={{ IndicatorSeparator: () => null }}
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