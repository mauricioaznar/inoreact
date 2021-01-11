
const imageUrl = process.env.NODE_ENV === 'development' ?
  'http://inoserver.test/equipments/' : process.env.REACT_APP_BASE_URL + 'equipments/'

export default imageUrl