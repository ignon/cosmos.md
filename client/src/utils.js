const delay = (timer=100) => ( 
  new Promise(r => setTimeout(_ => r()), timer)
 )

export const until = async (conditionFunc)  => {
  while (!conditionFunc()) await delay(30)
}

export function escapeRegexSubstring(string) {
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); // $& means the whole matched string
}