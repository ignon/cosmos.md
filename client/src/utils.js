const delay = (timer=100) => ( 
  new Promise(r => setTimeout(_ => r()), timer)
 )

export const until = async (conditionFunc)  => {
  while (!conditionFunc()) await delay(30)
}