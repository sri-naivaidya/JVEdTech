import { useEffect, useState } from 'react'
import { publicFetch } from '../utils/api'

export default function useCmsContent(endpoint, fallback) {
  const [items, setItems] = useState(fallback)

  useEffect(() => {
    let active = true
    publicFetch(endpoint, fallback).then((data) => {
      if (active && Array.isArray(data) && data.length) setItems(data)
    })
    return () => {
      active = false
    }
  }, [endpoint])

  return items
}
