import React from 'react'

import './styles.css'

const LoadingDiv = () => {

  return (
    <div id="loading-div" className='centered'>
      <p className='loading'> Loading </p><p className='p1'>.</p><p className='p2'>.</p><p className='p3'>.</p>
    </div>
  )
}

export default LoadingDiv;