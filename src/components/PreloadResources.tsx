'use client'

import ReactDOM from 'react-dom'

export function PreloadResources() {
  // Preload the profile image with the correct 'as' attribute
  ReactDOM.preload('/aashish_tangnami.jpg', { as: 'image' })
  
  return null
}