
"use client"
import Homelisting from '@components/Homelisting'
import useTitle from '@hooks/useTitle'
import React from 'react'

export default function Listing() {
  useTitle("Zuletzt angesehen")

  return (
    <div className='w-full'>
        <Homelisting list={"recently-viewed"}/>
    </div>
  )
}

