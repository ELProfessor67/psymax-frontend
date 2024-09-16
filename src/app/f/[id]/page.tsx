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
import TestingSidebar from '@/components/TestingSidebar';
import PermissionDialog from '@/components/PermissionDialog';
import ChatSidebar from '@/components/ChatSidebar';


interface IProps 
{
    params: {
        id: string
    },
    searchParams: {
        name: string
    }
}


const page:React.FC<IProps> = ({params,searchParams}) => {

    const room_id = params.id;
    console.log(room_id,'room_id')
    const username = searchParams.name;
    console.log(username,'username')

    const [testingOpen, setTestingOpen] = useState(false);
    const videoCanvasRef = useRef<HTMLVideoElement | null>(null);
    const canvasRef = useRef<HTMLCanvasElement | null>(null);
    const [isMicMute, setIsMicMute] = useState(true);
    const [isWebCamMute, setIsWebCamMute] = useState(true);
    const [isBlur, setIsBlur] = useState(false);
    const [selected, setSelected] = useState(0);
    const [permissionOpen, setPermisstionOpen] = useState(false);
    const [chatOpen, setChatOpen] = useState(false);
    
    const handleJoinCallRef = useRef(false);
    const selectedVideoRef = useRef<null | HTMLVideoElement>(null)

    
    const { audioPermisson, cameraPermisson } = useCheckPermission();
    const { handleJoin, participantsRef, videosElementsRef, audiosElementRef, socketIdRef, videoTrackRef, handleMuteUnmute,remoteVideoTracksRef } = useSocket(room_id, username, isWebCamMute, isMicMute, videoCanvasRef, canvasRef, isBlur);



    // on select video change
    useEffect(() => {
        const id = participantsRef.current[selected]?.socketId
        if(id && selectedVideoRef.current && remoteVideoTracksRef.current[id]){
            selectedVideoRef.current.srcObject = new MediaStream([remoteVideoTracksRef.current[id]]);
            selectedVideoRef.current.play();
        }
        
        if(id == socketIdRef.current && selectedVideoRef.current && videoTrackRef.current){
            
            selectedVideoRef.current.srcObject = new MediaStream([videoTrackRef.current]);
            selectedVideoRef.current.play();
        }

        
    },[selected,videoTrackRef.current,remoteVideoTracksRef.current])




    useEffect(() => {
        // calling only one time this function
        if (!handleJoinCallRef.current) {
            handleJoin();
            handleJoinCallRef.current = true;
        }
    }, []);


    const handleVideoMute = useCallback(() => {


        if(!cameraPermisson){
            setPermisstionOpen(true);
            return
        }

        if (isWebCamMute) {
            handleMuteUnmute(false, 'cam');
            setIsWebCamMute(false);
        } else {
            setIsWebCamMute(true);
            handleMuteUnmute(true, 'cam');
        }
    }, [isWebCamMute,cameraPermisson])


    const handleMicMute = useCallback(() => {
        if(!audioPermisson){
            setPermisstionOpen(true);
            return
        }
        if (isMicMute) {
            handleMuteUnmute(false, 'mic');
            setIsMicMute(false);
        } else {
            setIsMicMute(true);
            handleMuteUnmute(true, 'mic');
        }
    }, [isMicMute,audioPermisson])

    return (
        <section className='section'>
            {/* sessions  */}
            <video ref={videoCanvasRef} style={{ display: "none" }}></video>
            <canvas ref={canvasRef} width={640} height={480} style={{ display: "none" }}></canvas>

            <div className='flex'>
                <div className='w-[70vw] relative'>
                    {

                        participantsRef.current && participantsRef.current.length > 0 && participantsRef.current[selected] &&
                        <div className='w-full h-full flex items-center justify-center' key={participantsRef.current[selected].socketId}>
                            <div className={`${participantsRef.current[selected].isWebCamMute == true ? 'block': 'hidden'}`}>
                                <h1 className='text-2xl font-semibold'>{participantsRef.current[selected].socketId == socketIdRef.current && "Hello!"} {participantsRef.current[selected].name}</h1>
                            </div>
                            <div className={`${participantsRef.current[selected].isWebCamMute == false ? 'block': 'hidden'}`}>
                               <video ref={selectedVideoRef} autoPlay> </video>
                            </div>
                        </div>
                    }
                </div>
                <div className='h-[90vh] overflow-y-auto flex flex-wrap justify-center py-2 md:gap-4 p-4 w-[30vw]'>
                    {
                        participantsRef.current && participantsRef.current.length > 0 && participantsRef.current.map((participant: ParticipantService, index: number) => (
                            <RenderParticipants key={participant.socketId} onClick={() => setSelected(index)} {...participant} videosElementsRef={videosElementsRef} audiosElementRef={audiosElementRef} socketIdRef={socketIdRef} videoTrackRef={videoTrackRef} index={index} selected={selected}/>
                        ))
                    }

                </div>
            </div>

            {/* controlls */}
            <div className='py-2 px-6 flex items-center  justify-center md:justify-between h-[10vh]  gap-5'>
                <h1 className='text-black text-3xl font-semibold hidden md:block'>psymax</h1>

                <div className='flex items-center gap-4'>
                    <PermissionButton permission={audioPermisson} onClick={handleMicMute} className={`${isMicMute && audioPermisson ? 'bg-red-600 text-white' : 'bg-gray-200'}`}>
                        {isMicMute ? <FiMicOff /> : <FiMic />}
                    </PermissionButton>
                    <PermissionButton permission={cameraPermisson} onClick={handleVideoMute} className={`${isWebCamMute && audioPermisson ? 'bg-red-600 text-white' : 'bg-gray-200'}`}>
                        {isWebCamMute ? <FiCameraOff /> : <FiCamera />}
                    </PermissionButton>


                    <PermissionButton permission={cameraPermisson} onClick={() => setIsBlur(prev => !prev)} className={` ${isBlur ? 'bg-green-600' : 'bg-gray-200 relative'}`}>
                        <TbScreenShare />
                    </PermissionButton>



                    {/* <button className={`p-2 text-2xl rounded-full ${isBlur ? 'bg-green-600' : 'bg-gray-200'}  text-black relative`} onClick={() => setIsBlur(prev => !prev)}>
                        <TbScreenShare />
                    </button> */}
                    <button className='p-2 text-2xl rounded-full bg-gray-200 text-black relative' onClick={() => setTestingOpen(prev => !prev)}>
                        <IoSettingsOutline />
                    </button>


                    <button className='p-2 text-2xl rounded-full bg-gray-200 text-black relative md:hidden' onClick={() => setChatOpen(prev => !prev)}>
                        <IoMdChatbubbles />
                    </button>


                    <button className='p-2 px-4 text-2xl rounded-full bg-red-600 text-white relative'>
                        <FaPhoneSlash />
                    </button>



                </div>


                <button className='p-2 text-2xl rounded-full bg-gray-200 text-black relative hidden md:block' onClick={() => setChatOpen(prev => !prev)}>
                    <IoMdChatbubbles />
                </button>

            
            </div>
            <TestingSidebar open={testingOpen} onClose={() => setTestingOpen(false)}/>
            <PermissionDialog open={permissionOpen} onClose={() => setPermisstionOpen(false)}/>
            <ChatSidebar open={chatOpen} onClose={() => setChatOpen(false)} name={username} room_id={room_id}/>
            
        </section>
    )
}

export default page