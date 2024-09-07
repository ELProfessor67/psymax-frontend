import {  IVideoRef, IAudioRef } from '@/hooks/useSocket'
import React,{FC, MutableRefObject, useEffect, useRef} from 'react'


interface IProps {
    name: string,
    socketId: string,
    audioTrack:MediaStreamTrack | null
    videoTrack:MediaStreamTrack | null
    audiosElementRef: MutableRefObject<IAudioRef>
    videosElementsRef: MutableRefObject<IVideoRef>
    socketIdRef: MutableRefObject<string | null>
    videoTrackRef: MutableRefObject<MediaStreamTrack | null>
    isMicMute: Boolean
    isWebCamMute: Boolean
}

const RenderParticipants:FC<IProps> = ({socketId,name,videosElementsRef,audiosElementRef,socketIdRef,videoTrackRef,isMicMute,isWebCamMute}) => {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  
  const setVideoRefs = (ref: HTMLVideoElement | null) => {   
    videoRef.current = ref; 
    if(ref){
      videosElementsRef.current[socketId] = ref; 
    }
  };

  const setAudioRefs = (ref: HTMLVideoElement | null) => {   
    audioRef.current = ref; 
    if(ref){
      audiosElementRef.current[socketId] = ref; 
    }
  };

  useEffect(() => {
    if(socketIdRef.current == socketId){
      if(videoRef.current && videoTrackRef.current){
        videoRef.current.srcObject = new MediaStream([videoTrackRef.current])
      }
    }
  },[socketId,socketIdRef.current,videoTrackRef.current])

  return (
    <div className='w-[20rem] h-[15rem] md:w-[30rem] md:h-[20rem] bg-gray-50 shadow-xl rounded-md flex items-center justify-center'>
      <div className=''>
        
         <div className={`${isWebCamMute == false ? 'block': 'hidden'}`}>
         <video autoPlay ref={setVideoRefs}></video>
        </div>

        <h1 className={`text-2xl font-semibold ${isWebCamMute == true ? 'block': 'hidden'}`}>{name} {socketId == socketIdRef.current && "(You)"}</h1>
        <audio ref={setAudioRefs}></audio>
      </div>
    </div>
  )
}

export default RenderParticipants