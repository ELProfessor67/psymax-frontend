'use client'
import { Navigation, Pagination, Scrollbar, A11y } from 'swiper/modules';
import React, { useCallback, useEffect, useRef, useState } from 'react'
import { Swiper, SwiperSlide, useSwiper } from 'swiper/react';


// Import Swiper styles
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/scrollbar';

import PermissionButton from '@/components/PermissionButton';
import useCheckPermission from '@/hooks/useCheckPermission'
import useSocket from '@/hooks/useSocket';
import ParticipantService from '@/services/partcipants';
import RenderParticipants from '@/components/RenderParticipants';
import TestingSidebar from '@/components/TestingSidebar';
import PermissionDialog from '@/components/PermissionDialog';
import ChatSidebar from '@/components/ChatSidebar';
import Typewriter from 'typewriter-effect';
import { PiMicrophone, PiMicrophoneSlash, PiVideoCameraSlash, PiVideoCamera, PiAirplay, PiGear, PiPhoneX, PiChats, PiAddressBook } from "react-icons/pi";
import Sidebar from '@/components/Sidebar';
import useIsMobile from '@/hooks/useIsMobile';
import RenderParticipantsMobile from '@/components/RenderParticipantsMobile';
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";
import { buffer } from 'stream/consumers';

type Speed = "natural" | number

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
    const [sidebarOpen, setSideBarOpen] = useState(false);
    const [selectedSideBar, setSelectedSide] = useState<'chat' | 'settings'>('chat');
    const [showbtn, setshowbtn] = useState(false);


    const isMobile = useIsMobile()
    const prevRef = useRef(null);
    const nextRef = useRef(null);

    const timeoutref = useRef<NodeJS.Timeout | null>(null);





    const handleJoinCallRef = useRef(false);
    const selectedVideoRef = useRef<null | HTMLVideoElement>(null)


    const { audioPermisson, cameraPermisson } = useCheckPermission(setPermisstionOpen);
    const { handleJoin, participantsRef, videosElementsRef, audiosElementRef, socketIdRef, videoTrackRef, handleMuteUnmute, remoteVideoTracksRef, handleScreenShare, displayTrackRef } = useSocket(room_id, username, isWebCamMute, isMicMute, videoCanvasRef, canvasRef, isBlur, isScreenShare, setSuperForceRender, setPermisstionOpen, setIsScreenShare, setSelected);



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



    const handleCopy = useCallback(() => {
        const url = window.location.origin + `/?room=${room_id}`
        navigator.clipboard.writeText(url);
    }, []);


    const handleSidebarOpen = useCallback((type: 'chat' | 'settings') => {
        if (sidebarOpen && selectedSideBar === type) {
            setSideBarOpen(false);
            return
        }

        setSelectedSide(type);
        setSideBarOpen(true);
    }, [selectedSideBar, sidebarOpen])



    const handleClick = () => {
        setshowbtn(true);
        if (timeoutref.current) {

            clearTimeout(timeoutref.current)
        }
        timeoutref.current = setTimeout(() => setshowbtn(false), 3000)
    }



    return (
        <section className='section w-[100vw] h-[100vh] overflow-hidden' onClick={handleClick}>

            {/* {
                isScreenShare &&
                <div className={`bg-white absolute top-8 left-[50%] -translate-x-[50%] flex items-center z-50 shadow-xl px-2 py-2 rounded-md gap-4`}>
                    <p>Sie sind im Präsentationsmodus</p>
                    <button title={isScreenShare ? 'präsentieren stoppen' : 'Präsentieren'} className={`p-2 text-2xl rounded-full  relative bg-[#EEEEEE]`} onClick={shareScreen}>
                        <IoPauseOutline />
                    </button>
                    <button className='py-2 px-4 rounded-md bg-[#E30C40] text-white text-[14px] font-medium' onClick={shareScreen}>
                        Bendeen
                    </button>
                </div>
            } */}

            {/* sessions  */}
            <video ref={videoCanvasRef} style={{ display: "none" }}></video>
            <canvas ref={canvasRef} width={640} height={480} style={{ display: "none" }}></canvas>

            <div className={`flex flex-row`}>
                <div className='flex flex-1 flex-col md:flex-row relative'>


                    <div className={`flex-1 w-full md:w-auto mx-auto my-auto md:h-[90vh] ${isMobile && !showbtn ? 'h-[80vh]' : 'h-[70vh]'} `}>
                        {

                            participantsRef.current && participantsRef.current.length > 0 && participantsRef.current[selected] &&
                            <div className={`w-full flex items-center justify-center md:h-[90vh] ${isMobile && !showbtn ? 'h-[80vh]' : 'h-[70vh]'} ${participantsRef.current.length > 1 ? 'bg-[#3C3C3C] text-white' : 'bg-white'}`} key={participantsRef.current[selected].socketId}>
                                <div className={`absolute top-[50%] left-[50%]  -translate-x-[50%] -translate-y-[50%] ${(participantsRef.current[selected].isWebCamMute === true && participantsRef.current[selected].isShareScreen === false) ? 'block' : 'hidden'}`}>


                                    <h1 className='text-4xl font-semibold hello-text text-center select-none'>
                                        {`${participantsRef.current[selected].socketId == socketIdRef.current && participantsRef.current.length == 1 ? "Hello!" : ""} ${participantsRef.current[selected].name}`}
                                    </h1>
                                    {
                                        participantsRef.current.length == 1 &&
                                        <p className='text-[#707070] mt-2 text-[16px] subtext text-center select-none'>
                                            Es solite gleich losgehen.
                                        </p>
                                    }


                                </div>

                                <div className={`${(participantsRef.current[selected].isWebCamMute == false || participantsRef.current[selected].isShareScreen === true) ? 'block' : 'hidden'} w-full h-full`}>
                                    <video ref={selectedVideoRef} autoPlay className='w-full h-full object-cover'> </video>
                                </div>
                            </div>
                        }

                        {
                            participantsRef.current && participantsRef.current.length > 0 && !participantsRef.current[selected] &&
                            <div className={`w-full  flex items-center justify-center md:h-[90vh] ${isMobile && !showbtn ? 'h-[80vh]' : 'h-[70vh]'} ${participantsRef.current.length > 1 ? 'bg-[#3C3C3C] text-white' : 'bg-white'}`} key={participantsRef.current[0].socketId}>
                                <div className={`absolute top-[50%] left-[50%]  -translate-x-[50%] -translate-y-[50%] ${(participantsRef.current[0].isWebCamMute == true || participantsRef.current[0].isShareScreen == true) ? 'block' : 'hidden'}`}>
                                    <h1 className='text-4xl font-semibold hello-text text-center select-none'>

                                        {`${participantsRef.current[0].socketId == socketIdRef.current && participantsRef.current.length == 1 ? "Hello!" : ""} ${participantsRef.current[0].name}`}
                                    </h1>
                                    {
                                        participantsRef.current.length == 1 &&
                                        <p className='text-[#707070] mt-2 text-[16px] subtext text-center select-none'>
                                            Es solite gleich losgehen.
                                        </p>
                                    }


                                </div>
                                <div className={`${(participantsRef.current[0].isWebCamMute == false || participantsRef.current[0].isShareScreen === true) ? 'block' : 'hidden'} w-full h-full`}>
                                    <video ref={selectedVideoRef} autoPlay className='w-full h-full object-cover'> </video>
                                </div>
                            </div>
                        }
                    </div>



                    {
                        // desktop view
                        !isMobile ?
                            (
                                <>
                                    {
                                        participantsRef.current && participantsRef.current.length > 1 &&
                                        <div className={`md:h-[90vh] h-[30vh] relative overflow-x-auto md:overflow-x-hidden  flex flex-row justify-end items-end md:!flex-col md:gap-0 w-[100vw] md:w-[25vw] xl:w-[17vw] ${participantsRef.current.length > 1 ? 'bg-[#3C3C3C]' : 'bg-white'}`}>
                                            {
                                                participantsRef.current && participantsRef.current.length > 0 && participantsRef.current.map((participant: ParticipantService, index: number) => (
                                                    <RenderParticipants key={participant.socketId} onClick={() => setSelected(index)} {...participant} videosElementsRef={videosElementsRef} audiosElementRef={audiosElementRef} socketIdRef={socketIdRef} videoTrackRef={videoTrackRef} index={index} selected={selected} superForceRender={superForceRender} displayTrackRef={displayTrackRef} />
                                                ))
                                            }
                                        </div>
                                    }
                                </>
                            ) :

                            // mobile view 
                            (
                                <>
                                    {
                                        participantsRef.current && participantsRef.current.length > 1 &&
                                        <div className={`h-[20vh] relative overflow-x-scroll overflow-y-hidden  flex flex-row justify-start items-end w-[100vw] ${participantsRef.current.length > 1 ? 'bg-[#3C3C3C]' : 'bg-white'} relative`}>
                                            <Swiper
                                                modules={[Navigation, Pagination, Scrollbar, A11y]}
                                                spaceBetween={5}
                                                slidesPerView={participantsRef.current.length < 4 ? 2 : 3}
                                                onSlideChange={() => console.log('slide change')}
                                                onSwiper={(swiper) => console.log(swiper)}

                                                // pagination={{ clickable: true }}
                                                navigation={{
                                                    prevEl: prevRef.current,
                                                    nextEl: nextRef.current,
                                                }}

                                            >
                                                {
                                                    participantsRef.current && participantsRef.current.length > 0 && participantsRef.current.map((participant: ParticipantService, index: number) => {

                                                        return (
                                                            <div className={`${(selected === index && !(participant.socketId == socketIdRef.current && participant.isShareScreen)) ? "hidden" : "block"}`}>

                                                                <SwiperSlide >
                                                                    <RenderParticipantsMobile key={participant.socketId} onClick={() => setSelected(index)} {...participant} videosElementsRef={videosElementsRef} audiosElementRef={audiosElementRef} socketIdRef={socketIdRef} videoTrackRef={videoTrackRef} index={index} selected={selected} superForceRender={superForceRender} displayTrackRef={displayTrackRef} />
                                                                </SwiperSlide>
                                                            </div>
                                                        )
                                                    })
                                                }
                                            </Swiper>
                                            {
                                                participantsRef.current.length > 1 &&
                                                <>
                                                    <button ref={prevRef}
                                                        className={`${participantsRef.current.length > 4 ? 'block' : 'hidden'} absolute z-50 left-10 top-[50%] -translate-x-[50%] p-2 text-2xl rounded-full bg-gray-200 text-black`}><IoIosArrowBack /></button>
                                                    <button ref={nextRef} className={`${participantsRef.current.length > 4 ? 'block' : 'hidden'} absolute right-0 z-50 top-[50%] -translate-x-[50%] p-2 text-2xl rounded-full bg-gray-200 text-black`}><IoIosArrowForward /></button>
                                                </>
                                            }
                                        </div>
                                    }
                                </>
                            )
                    }


                </div>
                <Sidebar open={sidebarOpen} onClose={() => setSideBarOpen(false)}>
                    {
                        selectedSideBar == 'chat' ?
                            <ChatSidebar open={chatOpen} onClose={() => setChatOpen(false)} name={username} room_id={room_id} />
                            :
                            <TestingSidebar open={testingOpen} onClose={() => setTestingOpen(false)} setIsBlur={setIsBlur} isBlur={isBlur} audioPermisson={audioPermisson} cameraPermisson={cameraPermisson} />
                    }
                </Sidebar>

            </div>

            {/* controlls */}

            <div className={`${isMobile && !showbtn ? 'hidden' : 'block'} fixed bottom-0 left-0 right-0`}>
                <div className='py-2 px-6 flex items-center  justify-center md:justify-between h-[10vh]  gap-5'>
                    <img src='/logo.png' className='hidden md:block' />


                    <div className='flex items-center gap-4'>

                        <PermissionButton permission={audioPermisson} onClick={handleMicMute} className={`title-notification-container ${isMicMute && audioPermisson ? 'bg-red-600 text-white' : 'bg-gray-200'}`}>
                            <span className='title-notification absolute -top-[2.5rem] left-[50%] -translate-x-[50%] bg-gray-700 text-white text-[12px] font-bold z-50 whitespace-pre px-2 rounded-sm uppercase'>{!audioPermisson ? 'Weitere infos anzeigen' : isMicMute ? 'mIKRO einschalten' : 'mIKRO AusSchalten'}</span>
                            {isMicMute ? <PiMicrophoneSlash /> : <PiMicrophone />}
                        </PermissionButton>




                        <PermissionButton permission={cameraPermisson} onClick={handleVideoMute} className={`title-notification-container ${isWebCamMute && cameraPermisson ? 'bg-red-600 text-white' : 'bg-gray-200'}`}>
                            <span className='title-notification absolute -top-[2.5rem] left-[50%] -translate-x-[50%] bg-gray-700 text-white text-[12px] font-bold z-50 whitespace-pre px-2 rounded-sm uppercase'>{!cameraPermisson ? 'Weitere infos anzeigen' : isWebCamMute ? 'Video einschalten' : 'Video AusSchalten'}</span>
                            {isWebCamMute ? <PiVideoCameraSlash /> : <PiVideoCamera />}
                        </PermissionButton>


                        {/* <PermissionButton permission={cameraPermisson} onClick={() => setIsBlur(prev => !prev)} className={` ${isBlur ? 'bg-green-600' : 'bg-gray-200 relative'}`}>
                        <TbScreenShare />
                    </PermissionButton> */}



                        <button className={`title-notification-container p-2 text-2xl rounded-full md:block hidden  relative ${isScreenShare ? 'bg-red-600 text-white' : 'bg-gray-200 text-black'}`} onClick={shareScreen}>
                            <span className='title-notification absolute -top-[2.5rem] left-[50%] -translate-x-[50%] bg-gray-700 text-white text-[12px] font-bold z-50 whitespace-pre px-2 rounded-sm uppercase'>{isScreenShare ? 'präsentieren stoppen' : 'Präsentieren'}</span>
                            <PiAirplay />
                        </button>

                        <button className='title-notification-container p-2 text-2xl rounded-full bg-gray-200 text-black relative' onClick={() => handleSidebarOpen('settings')}>
                            <span className='title-notification absolute -top-[2.5rem] left-[50%] -translate-x-[50%] bg-gray-700 text-white text-[12px] font-bold z-50 whitespace-pre px-2 rounded-sm uppercase'>Einstellungen</span>
                            <PiGear />
                        </button>


                        <button className='p-2 title-notification-container text-2xl rounded-full bg-gray-200 text-black relative md:hidden' onClick={() => handleSidebarOpen('chat')} >
                            <span className='title-notification absolute -top-[2.5rem] left-[50%] -translate-x-[50%] bg-gray-700 text-white text-[12px] font-bold z-50 whitespace-pre px-2 rounded-sm uppercase'>CHAT</span>
                            <PiChats />
                        </button>

                        <button className='p-2 title-notification-container text-2xl rounded-full bg-gray-200 text-black relative' onClick={handleCopy}>
                            <span className='title-notification absolute -top-[2.5rem] left-[50%] -translate-x-[50%] bg-gray-700 text-white text-[12px] font-bold z-50 whitespace-pre px-2 rounded-sm uppercase'>ZUgangsdaten Kopieren</span>
                            <PiAddressBook />
                        </button>


                        <a href="/" className='p-2 title-notification-container px-4 text-2xl rounded-full bg-red-600 text-white relative' title='Verbindung trennen'>
                            <span className='title-notification absolute -top-[2.5rem] left-[50%] -translate-x-[50%] bg-gray-700 text-white text-[12px] font-bold z-50 whitespace-pre px-2 rounded-sm uppercase'>Verbindung trennen</span>
                            <PiPhoneX />
                        </a>



                    </div>


                    <button className='p-2 text-2xl title-notification-container rounded-full bg-gray-200 text-black relative hidden md:block' onClick={() => handleSidebarOpen('chat')} title='CHAT'>
                        <span className='title-notification absolute -top-[2.5rem] left-[50%] -translate-x-[50%] bg-gray-700 text-white text-[12px] font-bold z-50 whitespace-pre px-2 rounded-sm uppercase'>CHAT</span>
                        <PiChats />
                    </button>


                </div>
            </div>


            <PermissionDialog open={(!audioPermisson || !cameraPermisson)} onClose={() => setPermisstionOpen(false)} />


        </section>
    )
}

export default page