import React from 'react'
import { useParams } from 'react-router-dom'

const Match = () => {
  const params = useParams()
  return (
    <div>Match {params.id}</div>
  )
}

export default Match