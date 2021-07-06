/* eslint-disable react-hooks/exhaustive-deps */

import { useEffect, useState } from 'react'

export const useRefDimensions = (ref) => {
  const [dimensions, setDimensions] = useState({ width: 1, height: 2 })
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
 
export const useRefHeight = () => {

}

export const useWindowSize = () => {
  // Initialize state with undefined width/height so server and client renders match
  // Learn more here: https://joshwcomeau.com/react/the-perils-of-rehydration/
  const [windowSize, setWindowSize] = useState({
    width: undefined,
    height: undefined,
  });

  useEffect(() => {
    function handleResize() {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      })
    }

    window.addEventListener("resize", handleResize)

    handleResize()

    const cleanup = () => window.removeEventListener("resize", handleResize);
    return cleanup
  }, []);

  return windowSize;
}