'use client';
import MeetingTypeList from '@/components/ui/MeetingTypeList';
import { useGetCalls } from '@/hooks/useGetCalls';
import { Call } from '@stream-io/video-react-sdk';
import React from 'react'

const Home = () => {
  const today = new Date();
  const date = today.toLocaleDateString("en-US", {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
  const time = today.toLocaleTimeString("en-US", {
    hour: '2-digit',
    minute: '2-digit',
  });


  const { upcomingCalls } = useGetCalls();
  /* const firstUpcomingCallDate = upcomingCalls[0]?.state?.startsAt?.toLocaleDateString();
  console.log('firstUpcomingCallDate : ', firstUpcomingCallDate); */
  /* if (firstUpcomingCallDate && firstUpcomingCallDate === today.getDate()) {

  } */
  const todayUpcomingCalls = upcomingCalls?.length > 0 && upcomingCalls.filter((call : Call) => 
    (
      call.state.startsAt?.toLocaleDateString("en-US" ,  {
        weekday: 'long',
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      }) === date
    )
  );

  console.log('todayUpcomingCalls : ', todayUpcomingCalls);
  
  const nearestUpcomingCall = todayUpcomingCalls && todayUpcomingCalls?.reduce((prev : Call, curr: Call) => {
    return prev.state?.startsAt?.getTime()! < curr.state?.startsAt?.getTime()! ? prev : curr;
  },todayUpcomingCalls[0]);

  console.log('nearestUpcomingCall : ' , nearestUpcomingCall);
  const nearestCallTime = nearestUpcomingCall && nearestUpcomingCall.state?.startsAt?.toLocaleTimeString("en-US", {
    hour: '2-digit',
    minute: '2-digit',
  });

  return (
    <section className='flex size-full flex-col gap-10 text-white'>
      <div className='h-[300px] w-full rounded-[20px] bg-hero bg-cover'>
        <div className='flex flex-col h-full justify-between max-md:px-5 max-md:py-8 md:p-8 lg:p-11'>
          { nearestCallTime && <h2 className='
          glassmorphism rounded py-2 max-w-[270px] text-center text-base font-normal'
          >
            Upcoming meeting at: {nearestCallTime}
          </h2>}
          <div className='flex flex-col gap-2'>
            <h1 className='text-4xl font-extrabold lg:text-7xl'>{time}</h1>
            <p className='text-lg font-medium text-sky-1 lg:text-2xl'>{date}</p>
          </div>
        </div>
      </div>
      <MeetingTypeList/>
    </section>
  )
}

export default Home