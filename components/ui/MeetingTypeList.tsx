'use client'
import React, { useState } from 'react'
import MeetingCard from './MeetingCard'
import { useRouter } from 'next/navigation';
import MeetingModal from './MeetingModal';
import { useUser } from '@clerk/nextjs';
import { useToast } from "@/components/ui/use-toast";
import { Textarea } from "@/components/ui/textarea"
import { Call, useStreamVideoClient } from '@stream-io/video-react-sdk';
import ReactDatePicker from 'react-datepicker';
import { Input } from './input';

const MeetingTypeList = () => {
  const [meetingState, setMeetingState] = useState<'isScheduleMeeting' | 'isJoiningMeeting' | 'isInstantMeeting' | undefined>();
  const router = useRouter();
  const user = useUser();
  const client  = useStreamVideoClient();
  const { toast } = useToast();
  const [values, setValues] = useState({
    dateTime: new Date(),
    description: '',
    link: '',
  });
  const [callDetails, setCallDetails] = useState<Call>();
  const meetingLink = `${process.env.NEXT_PUBLIC_BASE_URL}/meeting/${callDetails?.id}`;

  const createMeeting = async () => {
    if(!client || !user) return;

    try {
      const callId = crypto.randomUUID();
      const call = client.call('default', callId);

      if(!call) throw new Error('failed to create call')
      if(!values.dateTime) {
        toast({ title: 'Please select date and time for the meeting'});
        return;
      }
      const startsAt = values.dateTime.toISOString() || new Date(Date.now()).toISOString();
      const description = values.description || 'Instant meeting';
      await call.getOrCreate({
        data: {
          starts_at : startsAt,
          custom: {
            description
          }
        }
      })
      setCallDetails(call);
      
      if(!values.description) {
        router.push(`/meeting/${call.id}`)
      }
      toast({
        title: "Meeting created"
      })
    } catch(error) {
      console.log(error);
      toast({
        title: "Failed to create meeting"
      })
    }
  }

  return (
    <section className='grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-4'>
      <MeetingCard 
        title="New Meeting"
        description="Start an instant meeting"
        img="/icons/add-meeting.svg"
        className="bg-orange-1"
        handleClick={() => setMeetingState('isInstantMeeting')}
      />
      <MeetingCard
        title="Join Meeting"
        description="via invitation link"
        img="/icons/join-meeting.svg"
        className="bg-blue-1"
        handleClick={() => setMeetingState('isJoiningMeeting')}
      />
      <MeetingCard
        title="Schedule Meeting"
        description="Plan your meeting"
        img="/icons/schedule.svg"
        className="bg-purple-1"
        handleClick={() => setMeetingState('isScheduleMeeting')} 
      />
      <MeetingCard 
        title="View Recordings"
        description="Check out your recordings"
        img="/icons/recordings.svg"
        className="bg-yellow-1"
        handleClick={() => router.push('/recordings')}
      />

      {
      !callDetails ? (
        <MeetingModal
          isOpen={meetingState === 'isScheduleMeeting'}
          onClose={() => setMeetingState(undefined)}
          title="Schedule meeting"
          handleClick={createMeeting}
        >
          <div className='flex flex-col gap-2.5'>
            <label className='text-base text-normal leading-[22px] text-sky-2'>Add a description</label>
            <Textarea 
              className='border-none bg-dark-3 focus-visible:ring-0 focus-visible:ring-offset-0'
              onChange={(e) => setValues({
                ...values,
                description: e.target.value,
                })}
            />
            <div className='flex flex-col w-full gap-2.5'>
              <label className='text-base text-normal leading-[22px] text-sky-2'>Select date and time</label>
              <ReactDatePicker 
                selected={values.dateTime} 
                onChange={
                  date => setValues({
                  ...values,
                  dateTime: date!,
                })}
                showTimeSelect
                timeFormat='HH:mm'
                timeIntervals={15}
                timeCaption='time'
                dateFormat="MMMM d, yyyy h:mm aa"
                className='w-full rounded bg-dark-3 p-2 focus:outline-none'
              />
            </div>
          </div>
        </MeetingModal>
      ) : (
        <MeetingModal
        isOpen={meetingState === 'isScheduleMeeting'}
        onClose={() => setMeetingState(undefined)}
        title="Meeting scheduled"
        className="text-center"
        buttonText="Copy meeting link"
        handleClick={() => {
          navigator.clipboard.writeText(meetingLink);
          toast({
            title: 'Meeting link copied'
          });
        }}
        image='/icons/checked.svg'
        buttonIcon='/icons/copy.svg'
        />
      )
    }

      <MeetingModal
        isOpen={meetingState === 'isInstantMeeting'}
        onClose={() => setMeetingState(undefined)}
        title="Start an instant meeting"
        className="text-center"
        buttonText="Start meeting"
        handleClick={createMeeting}
      />

      <MeetingModal
        isOpen={meetingState === 'isJoiningMeeting'}
        onClose={() => setMeetingState(undefined)}
        title="Join meeting via link"
        className='text-center'
        buttonText='Join meeting'
        handleClick={() => router.push(values.link)}
        >
          <div className='flex flex-col gap-2.5'>
            <label className='text-sky-2 text-base leading-[22px]'>Enter the link</label>
            <Input
              className='border-none bg-dark-3 focus-visible:ring-0 focus-visible:ring-offset-0' 
              onChange={(e) => setValues({
                ...values,
                link: e.target.value,
              })}
            />
          </div>
        </MeetingModal>
    </section>
  )
}

export default MeetingTypeList