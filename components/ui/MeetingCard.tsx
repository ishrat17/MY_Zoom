'use client'
import { cn } from '@/lib/utils'
import Image from 'next/image'
import React from 'react'

interface MeetingCardProps {
  title: string,
  description: string,
  img: string,
  className: string,
  handleClick: () => void,
}

const MeetingCard = ({title, description, img, className, handleClick}: MeetingCardProps) => {
  return (
    <div 
      className={cn('px-4 py-6 flex flex-col justify-between w-full xl:max-w-[270px] min-h-[260px] rounded-[14px] cursor-pointer',className)}
      onClick={handleClick}
    >
      <div className='flex-center glassmorphism rounded-[10px] size-12'>
        <Image
          src={img}
          alt={title}
          width={27}
          height={27}
        />
      </div>
      <div className='flex flex-col gap-2'>
        <h1 className='text-2xl font-bold'>{title}</h1>
        <p className='text-lg font-normal'>{description}</p>
      </div>
    </div>
  )
}

export default MeetingCard