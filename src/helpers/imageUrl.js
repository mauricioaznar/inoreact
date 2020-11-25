
const apiUrl = process.env.NODE_ENV === 'development' ?
  'http://inoserver.test/' : process.env.REACT_APP_BASE_URL

export default apiUrl