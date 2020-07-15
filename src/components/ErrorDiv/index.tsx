import React from 'react'
import { FiHome as Home } from 'react-icons/fi';

import './styles.css'

const LoadingDiv = () => {

  return (
    <div id="error-div" className='centered'>
      <div className="box">
        <h1>404 ERROR</h1>
        <h2>Game not found</h2>
        <a className="game-link" href='/'>Home <Home size={32} /></a>
      </div>
    </div>
  )
}

export default LoadingDiv;