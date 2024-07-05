'use client'
import { useGetCalls } from '@/hooks/useGetCalls'
import { Call, CallRecording } from '@stream-io/video-react-sdk';

import React, { useEffect, useState } from 'react'
import Card from './Card';
import { useRouter } from 'next/navigation';
import Loader from '@/components/ui/Loader';
import { useToast } from './use-toast';

const CallList = ({ type } : { type: 'ended' | 'upcoming' | 'recordings'} ) => {

  const { 
    previousCalls,
    upcomingCalls,
    callRecordings,
    isLoading 
  } = useGetCalls();
  const [recordings, setRecordings] = useState<CallRecording[]>([]);
  const router  = useRouter();
  const { toast } = useToast();

  const getCalls = () => {
    switch(type) {
        case 'ended' : 
            return previousCalls;
            break;

        case 'upcoming' : 
            return upcomingCalls;
            break;

        case 'recordings' : 
            return recordings;
            break;
        
        default: 
            return [];
    }
  };

  const getMessageForNoCalls = () => {
    switch(type) {
        case 'ended' : 
            return 'No previous calls';
            break;

        case 'upcoming' : 
            return 'No upcoming calls';
            break;

        case 'recordings' : 
            return 'No recordings';
            break;
        
        default: 
            return '';
    }
  };

  useEffect(() => {
    try {
        const fetchRecordings = async () => {
            const callData = await Promise.all(callRecordings.map(meeting => meeting.queryRecordings()));
            const recordingVideos = callData.filter(call => call.recordings.length > 0).flatMap(call => call.recordings);
            setRecordings(recordingVideos);
        };
        if (type=== 'recordings') {
            fetchRecordings();
        }
    } catch(error) {
        toast({
            title: 'Try again later'
        })
    }
  }, [type, callRecordings]);

  if(isLoading) return <Loader />;

  const calls = getCalls();
  const message = getMessageForNoCalls();

  return (
    <div className='grid grid-cols-1 gap-5 xl:grid-cols-2'>
        {calls && calls.length > 0 ? calls.map(
            (call : Call | CallRecording) => (
                <Card
                  key={(call as Call).id || (call as CallRecording)?.filename}
                  isPreviousMeeting={type === 'ended'}
                  icon={
                    type === 'ended' ? '/icons/previous.svg' :
                    type === 'upcoming' ? '/icons/upcoming.svg' :
                    'icons/recordings.svg'
                  }
                  title={
                    (call as Call).state?.custom?.description || 
                    (call as CallRecording).filename?.substring(0, 20) ||
                    'Personal Meeting'
                  }
                  date={
                    (call as Call).state?.startsAt ||
                    (call as CallRecording).start_time
                  }
                  buttonText1={type==='recordings' ? 'Play' :  'Start'}
                  buttonIcon1={type==='recordings' ? '/icons/play.svg' : undefined}
                  link={
                    ( call as CallRecording).url || 
                    `${process.env.NEXT_PUBLIC_BASE_URL}/meeting/${(call as Call).id}`
                  }
                  buttonText2={type=== 'recordings' ? 'Copy link' : 'Copy invitation'}
                  buttonIcon2={type=== 'recordings' ? '/icons/share.svg' : '/icons/copy.svg'}
                  handleClick={
                    type=== 'recordings' ? 
                    () => router.push(`${(call as CallRecording).url}`) :
                    () => router.push(`meeting/${(call as Call).id}`)
                  }
                />
            )
        ) : (
            <h1>{message}</h1>
        )
    }
    </div>
  )
}

export default CallList