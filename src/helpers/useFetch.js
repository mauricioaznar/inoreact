import React from 'react'
import axios from 'axios'
import authHeader from './authHeader'

export default function useFetch (url, dependencies = []) {
  const [data, setData] = React.useState(null);

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
  }, [url, JSON.stringify(dependencies)]);

  return data;
};