import { useEffect, useState, useCallback } from 'react'

function parseHash() {
  const hash = window.location.hash.replace(/^#\/?/, '')
  const [path, ...rest] = hash.split('/')
  return { path: path || 'catalog', param: rest.join('/') || null }
}

export function useHashRoute() {
  const [route, setRoute] = useState(parseHash)

  useEffect(() => {
    const onHashChange = () => setRoute(parseHash())
    window.addEventListener('hashchange', onHashChange)
    return () => window.removeEventListener('hashchange', onHashChange)
  }, [])

  const navigate = useCallback((path, param) => {
    window.location.hash = param ? `/${path}/${param}` : `/${path}`
  }, [])

  return { ...route, navigate }
}
