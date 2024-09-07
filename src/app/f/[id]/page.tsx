'use client'

import React, { useCallback, useEffect, useRef, useState } from 'react'

import PermissionButton from '@/components/PermissionButton';
import useCheckPermission from '@/hooks/useCheckPermission'

import { FiMic, FiMicOff, FiCamera, FiCameraOff } from "react-icons/fi";
import { TbScreenShare } from "react-icons/tb";
import { IoSettingsOutline } from "react-icons/io5";
import { FaPhoneSlash } from "react-icons/fa6";
import { IoMdChatbubbles } from "react-icons/io";
import useSocket from '@/hooks/useSocket';
import ParticipantService from '@/services/partcipants';
import RenderParticipants from '@/components/RenderParticipants';



const room_id = "testing"
const username = "zeeshan raza"

const page = () => {
    const [isMicMute,setIsMicMute] = useState(true);
    const [isWebCamMute,setIsWebCamMute] = useState(true);
    const { audioPermisson, cameraPermisson } = useCheckPermission();
    const {handleJoin,participantsRef,videosElementsRef,audiosElementRef,socketIdRef,videoTrackRef,handleMuteUnmute} = useSocket(room_id,username,isWebCamMute,isMicMute);
    const handleJoinCallRef = useRef(false);

   


    useEffect(() => {
        // calling only one time this function
        if(!handleJoinCallRef.current){
            handleJoin();
            handleJoinCallRef.current = true;
        }
    },[]);


    const handleVideoMute = useCallback(() => {
        if(isWebCamMute){
            handleMuteUnmute(false,'cam');
            setIsWebCamMute(false);
        }else{
            setIsWebCamMute(true);
            handleMuteUnmute(true,'cam');
        }
    },[isWebCamMute])


    const handleMicMute = useCallback(() => {
        if(isMicMute){
            handleMuteUnmute(false,'mic');
            setIsMicMute(false);
        }else{
            setIsMicMute(true);
            handleMuteUnmute(true,'mic');
        }
    },[isMicMute])

    return (
        <section className='section '>
            {/* sessions  */}
            <div className='h-[90vh] overflow-y-auto flex flex-wrap justify-center py-2 md:gap-4'>
                {
                    participantsRef.current && participantsRef.current.length > 0 && participantsRef.current.map((participant:ParticipantService) => (
                        <RenderParticipants key={participant.socketId} {...participant} videosElementsRef={videosElementsRef} audiosElementRef={audiosElementRef} socketIdRef={socketIdRef} videoTrackRef={videoTrackRef}/>
                    ))
                }
                {/* {
                    participantsRef.current && participantsRef.current.length == 1 && participantsRef.current.map((participant:ParticipantService) => (
                        <div className='w-full h-full flex items-center justify-center' key={participant.socketId}>
                            <div className=''>
                            <h1 className='text-2xl font-semibold'> HELLO {participant.name?.toUpperCase()}</h1>
                            </div>
                        </div>
                    ))
                } */}
            </div>

            {/* controlls */}
            <div className='py-2 px-6 flex items-center  justify-center md:justify-between h-[10vh]  gap-5'>
                <h1 className='text-black text-3xl font-semibold hidden md:block'>psymax</h1>

                <div className='flex items-center gap-4'>
                    <PermissionButton permission={audioPermisson} onClick={handleMicMute}>
                        {isMicMute ?<FiMicOff /> :<FiMic /> } 
                    </PermissionButton>
                    <PermissionButton permission={cameraPermisson}  onClick={handleVideoMute}>
                        {isWebCamMute ?<FiCameraOff /> :<FiCamera /> }
                    </PermissionButton>



                    <button className='p-2 text-2xl rounded-full bg-gray-200 text-black relative'>
                        <TbScreenShare />
                    </button>
                    <button className='p-2 text-2xl rounded-full bg-gray-200 text-black relative'>
                        <IoSettingsOutline />
                    </button>


                    <button className='p-2 text-2xl rounded-full bg-gray-200 text-black relative md:hidden'>
                        <IoMdChatbubbles />
                    </button>


                    <button className='p-2 px-4 text-2xl rounded-full bg-red-600 text-white relative'>
                        <FaPhoneSlash />
                    </button>



                </div>


                <button className='p-2 text-2xl rounded-full bg-gray-200 text-black relative hidden md:block'>
                    <IoMdChatbubbles />
                </button>
            </div>
        </section>
    )
}

export default page