const apiUrl = process.env.NODE_ENV === 'development' ?
  'http://inoserver.test/api/' : 'https://babytester.grupoinopack.com/api/'

console.log(process.env)
console.log(process.env)

export default apiUrl
