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

    async function fetchData() {
      const response = await axios.get(url, {headers: {...authHeader()}});
      if (!unmounted) {
        setData(response.data.data)
      }
    }

    if (!unmounted) {
      fetchData();
    }
    return () => {
      unmounted = true
    };
  }, [url].concat(...watchArray));

  return data;
};