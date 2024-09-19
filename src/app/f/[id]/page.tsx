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


interface IProps {
    params: {
        id: string
    },
    searchParams: {
        name: string
    }
}


const page: React.FC<IProps> = ({ params, searchParams }) => {

    const room_id = params.id;
    console.log(room_id, 'room_id')
    const username = searchParams.name;
    console.log(username, 'username')

    const [testingOpen, setTestingOpen] = useState(false);
    const videoCanvasRef = useRef<HTMLVideoElement | null>(null);
    const canvasRef = useRef<HTMLCanvasElement | null>(null);
    const [isMicMute, setIsMicMute] = useState(true);
    const [isWebCamMute, setIsWebCamMute] = useState(true);
    const [isBlur, setIsBlur] = useState(false);
    const [selected, setSelected] = useState(0);
    const [permissionOpen, setPermisstionOpen] = useState(false);
    const [chatOpen, setChatOpen] = useState(false);
    const [isScreenShare, setIsScreenShare] = useState(false);
    const [superForceRender, setSuperForceRender] = useState(0);




    const handleJoinCallRef = useRef(false);
    const selectedVideoRef = useRef<null | HTMLVideoElement>(null)


    const { audioPermisson, cameraPermisson } = useCheckPermission(setPermisstionOpen);
    const { handleJoin, participantsRef, videosElementsRef, audiosElementRef, socketIdRef, videoTrackRef, handleMuteUnmute, remoteVideoTracksRef, handleScreenShare, displayTrackRef } = useSocket(room_id, username, isWebCamMute, isMicMute, videoCanvasRef, canvasRef, isBlur, isScreenShare, setSuperForceRender, setPermisstionOpen, setIsScreenShare);



    // on select video change
    useEffect(() => {

        const id = participantsRef.current[selected]?.socketId
        if (id && selectedVideoRef.current && remoteVideoTracksRef.current[id]) {
            selectedVideoRef.current.srcObject = new MediaStream([remoteVideoTracksRef.current[id]]);
            selectedVideoRef.current.play();
            return
        }


        if (id == socketIdRef.current && selectedVideoRef.current && displayTrackRef.current) {
            selectedVideoRef.current.srcObject = new MediaStream([displayTrackRef.current]);
            selectedVideoRef.current.play();
            return
        }

        if (id == socketIdRef.current && selectedVideoRef.current && videoTrackRef.current) {

            selectedVideoRef.current.srcObject = new MediaStream([videoTrackRef.current]);
            selectedVideoRef.current.play();
            return
        }






        const me = participantsRef.current[0]?.socketId


        if (me && selectedVideoRef.current && displayTrackRef.current) {
            selectedVideoRef.current.srcObject = new MediaStream([displayTrackRef.current]);
            selectedVideoRef.current.play();
            return
        }

        if (me && selectedVideoRef.current && videoTrackRef.current) {
            selectedVideoRef.current.srcObject = new MediaStream([videoTrackRef.current]);
            selectedVideoRef.current.play();
            return
        }




    }, [selected, videoTrackRef.current, remoteVideoTracksRef.current, participantsRef.current, displayTrackRef.current, superForceRender])




    useEffect(() => {
        // calling only one time this function
        if (!handleJoinCallRef.current) {
            handleJoin();
            handleJoinCallRef.current = true;
        }
    }, []);


    const handleVideoMute = useCallback(() => {


        if (!cameraPermisson) {
            setPermisstionOpen(true);
            return
        }

        if (isWebCamMute) {
            handleMuteUnmute(false, 'cam');
            setIsWebCamMute(false);
        } else {
            setIsScreenShare(false);
            handleScreenShare('unshare');
            setIsWebCamMute(true);
            handleMuteUnmute(true, 'cam');
        }
    }, [isWebCamMute, cameraPermisson])


    const handleMicMute = useCallback(() => {
        if (!audioPermisson) {
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
    }, [isMicMute, audioPermisson])



    const shareScreen = useCallback(() => {
        if (isScreenShare) {
            setIsScreenShare(false);
            handleScreenShare('unshare');
        } else {
            handleScreenShare('share');
            setIsWebCamMute(true);
            setIsScreenShare(true)
        }
    }, [isScreenShare]);



    return (
        <section className='section'>
            {/* sessions  */}
            <video ref={videoCanvasRef} style={{ display: "none" }}></video>
            <canvas ref={canvasRef} width={640} height={480} style={{ display: "none" }}></canvas>

            <div className='flex flex-col md:flex-row'>
                <div className='flex-1 w-full md:w-auto relative mx-auto my-auto md:h-[90vh] h-[60vh]'>
                    {

                        participantsRef.current && participantsRef.current.length > 0 && participantsRef.current[selected] &&
                        <div className='w-full relative flex items-center justify-center md:h-[90vh] h-[60vh]' key={participantsRef.current[selected].socketId}>
                            <div className={`${(participantsRef.current[selected].isWebCamMute === true && participantsRef.current[selected].isShareScreen === false) ? 'block' : 'hidden'}`}>
                                <h1 className='text-4xl font-semibold'>{participantsRef.current[selected].socketId == socketIdRef.current && participantsRef.current.length == 1 && "Hello!"} {participantsRef.current[selected].name}</h1>
                            </div>
                            <div className={`${(participantsRef.current[selected].isWebCamMute == false || participantsRef.current[selected].isShareScreen === true) ? 'block' : 'hidden'} w-full h-full`}>
                                <video ref={selectedVideoRef} autoPlay className='w-full h-full object-contain'> </video>
                            </div>
                        </div>
                    }

                    {
                        participantsRef.current && participantsRef.current.length > 0 && !participantsRef.current[selected] &&
                        <div className='w-full md:h-[90vh] h-[60vh]  flex items-center justify-center relative' key={participantsRef.current[0].socketId}>
                            <div className={`${(participantsRef.current[0].isWebCamMute == true || participantsRef.current[0].isShareScreen == true) ? 'block' : 'hidden'}`}>
                                <h1 className='text-4xl font-semibold'>{participantsRef.current[0].socketId == socketIdRef.current && "Hello!"} {participantsRef.current[0].name}</h1>
                            </div>
                            <div className={`${(participantsRef.current[0].isWebCamMute == false || participantsRef.current[0].isShareScreen === true) ? 'block' : 'hidden'} w-full h-full`}>
                                <video ref={selectedVideoRef} autoPlay className='w-full h-full object-contain'> </video>
                            </div>
                        </div>
                    }
                </div>
                {
                    participantsRef.current && participantsRef.current.length > 1 &&
                    <div className='md:h-[90vh] h-[30vh] relative overflow-x-auto md:overflow-x-hidden flex flex-wrap flex-row md:flex-col justify-center py-2 md:gap-4 p-4 w-[30vw]'>
                        {
                            participantsRef.current && participantsRef.current.length > 0 && participantsRef.current.map((participant: ParticipantService, index: number) => (
                                <RenderParticipants key={participant.socketId} onClick={() => setSelected(index)} {...participant} videosElementsRef={videosElementsRef} audiosElementRef={audiosElementRef} socketIdRef={socketIdRef} videoTrackRef={videoTrackRef} index={index} selected={selected} superForceRender={superForceRender} displayTrackRef={displayTrackRef} />
                            ))
                        }
                    </div>
                }

                <ChatSidebar open={chatOpen} onClose={() => setChatOpen(false)} name={username} room_id={room_id} />
                <TestingSidebar open={testingOpen} onClose={() => setTestingOpen(false)} setIsBlur={setIsBlur} isBlur={isBlur} />

            </div>

            {/* controlls */}
            <div className='fixed bottom-0 left-0 right-0'>
                <div className='py-2 px-6 flex items-center  justify-center md:justify-between h-[10vh]  gap-5'>
                    <img src='/logo.png' className='hidden md:block' />


                    <div className='flex items-center gap-4'>
                        <PermissionButton permission={audioPermisson} onClick={handleMicMute} className={`${isMicMute && audioPermisson ? 'bg-red-600 text-white' : 'bg-gray-200'}`}>
                            {isMicMute ? <FiMicOff /> : <FiMic />}
                        </PermissionButton>
                        <PermissionButton permission={cameraPermisson} onClick={handleVideoMute} className={`${isWebCamMute && audioPermisson ? 'bg-red-600 text-white' : 'bg-gray-200'}`}>
                            {isWebCamMute ? <FiCameraOff /> : <FiCamera />}
                        </PermissionButton>


                        {/* <PermissionButton permission={cameraPermisson} onClick={() => setIsBlur(prev => !prev)} className={` ${isBlur ? 'bg-green-600' : 'bg-gray-200 relative'}`}>
                        <TbScreenShare />
                    </PermissionButton> */}



                        <button className={`p-2 text-2xl rounded-full  relative ${isScreenShare ? 'bg-green-600 text-white' : 'bg-gray-200 text-black'}`} onClick={shareScreen}>
                            <TbScreenShare />
                        </button>
                        <button className='p-2 text-2xl rounded-full bg-gray-200 text-black relative' onClick={() => { setTestingOpen(prev => !prev) }}>
                            <IoSettingsOutline />
                        </button>


                        <button className='p-2 text-2xl rounded-full bg-gray-200 text-black relative md:hidden' onClick={() => { setChatOpen(prev => !prev) }}>
                            <IoMdChatbubbles />
                        </button>


                        <a href="/" className='p-2 px-4 text-2xl rounded-full bg-red-600 text-white relative'>
                            <FaPhoneSlash />
                        </a>



                    </div>


                    <button className='p-2 text-2xl rounded-full bg-gray-200 text-black relative hidden md:block' onClick={() => setChatOpen(prev => !prev)}>
                        <IoMdChatbubbles />
                    </button>


                </div>
            </div>


            <PermissionDialog open={permissionOpen} onClose={() => setPermisstionOpen(false)} />


        </section>
    )
}

export default page