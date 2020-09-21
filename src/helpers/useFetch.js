import React from 'react'
import axios from 'axios'
import authHeader from './authHeader'

export default function useFetch (url, deps) {
  const [data, setData] = React.useState(null);

  let watchArray = []

  if (deps) {
    watchArray.concat(...deps)
  }

  // empty array as second argument equivalent to componentDidMount
  React.useEffect(() => {
    let unmounted = false

    const getPromise = axios.get(url, {headers: {...authHeader()}})

    if (!unmounted) {
      getPromise
        .then(response => {
          if (!unmounted) {
            setData(response.data.data)
          }
        })
        .catch(error => {
          if (!unmounted) {
            setData('Error')
          }
        })
      ;
    }
    return () => {
      unmounted = true
    };
  }, [url].concat(...watchArray));

  return data;
};