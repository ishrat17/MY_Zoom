import CallList from '@/components/ui/CallList'
import React from 'react'

const Upcoming = () => {
  return (
    <section className='flex size-full flex-col text-white gap-10'>
        <h1 className='font-bold text-3xl'>Upcoming Meetings</h1>
        <CallList type="upcoming"/>
    </section>
  )
}

export default Upcoming