import React from 'react'
import { useParams } from 'react-router-dom'

const Tournament = () => {
    const params = useParams()
  return (
    <div>Tournament {params.id}</div>
  )
}

export default Tournament