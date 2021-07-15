/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from "react/cjs/react.development";

export const delay = (timer=100) => ( 
  new Promise(r => setTimeout(_ => r()), timer)
 )

export const until = async (conditionFunc)  => {
  while (!conditionFunc()) await delay(30)
}

export function escapeRegexSubstring(string) {
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); // $& means the whole matched string
}

export const useTimer = (initialPause) => {
  const [timeout, setTimeout] = useState(null)
  const [timerCompleted, setCompleted] = useState(false)

  const setTimer = (time=initialPause) => {
    console.log('setting timer: ', time)
    clearTimeout(timeout)
    const pause = Math.ceil(time * 60 * 1000)
    const t = window.setTimeout(() =>  setCompleted(true), pause)
    setTimeout(t)
    setCompleted(false)
  }

  useEffect(() => setTimer(), [])

  return { timerCompleted, setTimer }
}