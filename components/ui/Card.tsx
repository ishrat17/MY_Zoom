import { avatarImages } from '@/app/constants';
import { cn } from '@/lib/utils';
import Image from 'next/image';

import React from 'react'
import { Button } from './button';
import { useToast } from "@/components/ui/use-toast";


interface MeetingCardProps {
    isPreviousMeeting: boolean,
    icon: string,
    title: string,
    date: string | Date,
    buttonText1?: string,
    buttonIcon1?: string,
    buttonText2?: string,
    buttonIcon2?: string,
    link: string,
    handleClick?: () => void,
};


const Card = ({isPreviousMeeting, icon, title, date, buttonText1, buttonIcon1, buttonText2, buttonIcon2, link, handleClick} : MeetingCardProps) => {
  const formattedDate = date.toLocaleString(undefined, {year: 'numeric', month: 'long', day: '2-digit', hour: '2-digit', hour12: true, minute:'2-digit'});
  const { toast } = useToast();
  return (
    <section className='flex flex-col justify-between px-8 py-6 gap-9 min-h-[258px] w-full xl:max-w-[533px] bg-dark-1 rounded-[14px]'>
        <article className='flex flex-col gap-5'>
            <Image src={icon} alt="meetingType" width={28} height={28} />
            <div className='flex justify-between'>
                <div className='flex flex-col gap-2'>
                    <h1 className='font-bold text-2xl'>{title}</h1>
                    <p className='font-normal text-base'>{formattedDate}</p>
                </div>
            </div>
        </article>
        <article className={cn("flex items-center relative gap-12", {})}>
            <div className='relative flex w-full max-sm:hidden'>
                {avatarImages.map((image, index) => (
                    <Image 
                      key={index}
                      className={cn('rounded-full', {'absolute': index > 0})}
                      style={{top: 0, left: index * 28}}
                      src={image} 
                      alt="attendees"
                      height={40} 
                      width={40}
                    />
                ))}
                <div className="flex-center absolute left-[136px] size-10 rounded-full border-[5px] border-dark-3 bg-dark-4">
                +5
                </div>
            </div>
            {!isPreviousMeeting && (
                <div className='flex gap-2'>
                    {buttonText1 && (
                         <Button className='bg-blue-1 rounded px-6' onClick={handleClick}>
                            {buttonIcon1 && <Image src={buttonIcon1} alt='feature' width={20} height={20}/>}
                            &nbsp; {buttonText1}
                        </Button>
                    )}
                    <Button className='bg-blue-1 rounded px-6' onClick={() => {
                        navigator.clipboard.writeText(link);
                        toast({
                            title: 'Link copied'
                        })
                    }}>
                    {buttonIcon2 && <Image src={buttonIcon2} alt="feature" width={20} height={20}/>}
                        &nbsp; {buttonText2}
                    </Button>
                </div>
            )}
        </article>
    </section>
  )
}

export default Card