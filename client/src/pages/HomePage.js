import React, { useEffect } from 'react'
import GeneratorQR from '../components/GeneratorQR'

export default function HomePage({ socket }) {
 
  return <>
    <GeneratorQR value="/c" />
  </>
}
