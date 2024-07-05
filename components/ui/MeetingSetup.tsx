'use client'
import { DeviceSettings, VideoPreview, useCall } from '@stream-io/video-react-sdk'
import React, { useEffect, useState } from 'react'
import { Button } from './button';

const MeetingSetup = ({ onCompleteSetup }: { onCompleteSetup: (value: boolean) => void }) => {

    const [isMicCameraOn, setMicCameraOn] = useState(false);
    const call = useCall();

    if(!call) {
        throw new Error('useCall must be called from within StreamCall');
    }

    useEffect(() => {
        if(isMicCameraOn) {
            call?.camera.disable();
            call?.microphone.disable();
        } else {
            call?.camera.enable();
            call?.microphone.enable();
        }
    },[isMicCameraOn, call?.camera, call?.microphone]);
    
    return (
    <div className='flex h-screen w-full flex-col items-center justify-center gap-3 text-white'>
        <h1 className='text-2xl font-bold'>Set Up</h1>
        <VideoPreview />
        <div className='flex h-[16] items-center justify-center gap-3'>
            <label className='flex items-center justify-center gap-2 font-medium'>
                <input 
                    type="checkbox"
                    checked={isMicCameraOn}
                    onChange={e => setMicCameraOn(e.target.checked)}
                />
                Join with mic and camera off
            </label>
            <DeviceSettings/>
        </div>
        <Button className='rounded-md bg-green-500 py-2.5 px-4' onClick={() => {
            call.join();
            onCompleteSetup(true);
            }}>
            Join meeting
        </Button>
    </div>
  )
}

export default MeetingSetup