import React from 'react'
import { useParams } from 'react-router-dom'

const Team = () => {
    const params = useParams()
  return (
    <div>Team {params.id}</div>
  )
}

export default Team