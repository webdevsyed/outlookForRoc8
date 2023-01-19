import React from 'react'
import loading from '../loading.gif'

export default function Spinner() {
  return (
    <div key ={0} style={{textAlign:"center"}}>
        <img src={loading} alt="spinner" width={64}></img>
      </div>
  )
}

