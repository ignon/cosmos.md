/* eslint-disable react-hooks/exhaustive-deps */

import { useEffect, useState } from 'react'

const useRefDimensions = (ref) => {
  const [dimensions, setDimensions] = useState({ with: 1, height: 1 })

  useEffect(() => {
    if (ref.current) {
      const { current } = ref
      const boundingRect = current.getBoundingClientRect()
      const { width, height } = boundingRect
      setDimensions({ width, height })
    }
  }, [ref])

  return dimensions
}
 

export default useRefDimensions