const apiUrl = process.env.NODE_ENV === 'development' ?
  'http://inoserver.test/api/' : process.env.REACT_APP_BASE_URL

export default apiUrl
