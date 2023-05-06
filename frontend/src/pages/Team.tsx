import React from 'react'
import { useParams } from 'react-router-dom'
export interface Team {
  id: number
  name: string
  tournaments: Tournament[]
}

export interface Tournament {
  id: number
  name: string
  prize: number
  registration_opened: boolean
  starts: string
  active: boolean
  played: boolean
}

const Team = () => {
    const params = useParams()
  return (
    <div>Team {params.id}</div>
  )
}

export default Team