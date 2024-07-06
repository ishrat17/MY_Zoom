'use client';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { useGetCallById } from '@/hooks/useGetCallByID';
import { useUser } from '@clerk/nextjs';
import { Call, useStreamVideoClient } from '@stream-io/video-react-sdk';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import React from 'react'

const Table = ({title, description} : {title: string, description: string}) => (
     <div className='flex flex-col gap-2 items-start xl:flex-row'>
        <h1 className='font-medium text-base text-sky-1 lg:text-xl xl:min-w-32'>{title}:</h1>
        <h1 className='font-bold truncate text-sm max-sm:max-w-[320px] lg:text-xl'>{description}</h1>
    </div>
);

const PersonalRoom = () => {
    const { user }  = useUser();
    const router = useRouter();
    const client = useStreamVideoClient();
    const meetingId = user?.id;
    const meetingLink = `${process.env.NEXT_PUBLIC_BASE_URL}/meeting/${meetingId}?personal=true`;
    const { call, isCallLoading } = useGetCallById(meetingId!);
    const startRoom = async () => {
        try {
            if (!client || !user) return;
            if (!isCallLoading && !call) {
                const newCall = client.call('default', meetingId!);
                await newCall.getOrCreate({
                    data: {
                        starts_at: new Date().toISOString(),
                    }
                })
            }
            router.push(`meeting/${meetingId}?personal=true`);
            toast({
                title: 'Personal room started'
            });
            
        } catch(error) {
            console.log(error);
            toast({
              title: "Failed to create meeting"
            })
          }
    };
    const { toast } = useToast();
    return (
        <section className='flex flex-col size-full text-white gap-10'>
            <h1 className='font-bold text-3xl'>Personal Room</h1>
            <div className='flex w-full flex-col gap-8 xl: max-w-[900px]'>
                <Table title='Topic' description={`${user?.username}'s meeting room`}/>
                <Table title='Meeting Id' description={meetingId!} />
                <Table title='Invite Link' description={meetingLink} />
            </div>
            <div className='flex w-full gap-5'>
                <Button className='bg-blue-1' onClick={startRoom}>Start the meeting</Button>
                <Button className='bg-dark-3' onClick={() => {
                    navigator.clipboard.writeText(meetingLink);
                    toast({
                        title: 'Link copied'
                    });
                }}>
                    <Image alt="invitation" src="/icons/copy.svg" width={20} height={20}/>
                    &nbsp; Copy invitation
                </Button>
            </div>  
        </section>
      )
}

export default PersonalRoom