const apiUrl = process.env.NODE_ENV === 'development' ?
  'http://inoserver.test/api/' : 'https://babytester.grupoinopack.com/api/'

export default apiUrl