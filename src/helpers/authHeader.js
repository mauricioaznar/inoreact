export default function () {
  const authStorage = JSON.parse(window.localStorage.getItem('auth'))
  if (authStorage) {
    return {'Authorization': 'Bearer ' + authStorage.token}
  } else {
    return {}
  }
}