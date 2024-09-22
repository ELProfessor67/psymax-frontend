import { IVideoRef, IAudioRef } from '@/hooks/useSocket'
import React, { Dispatch, FC, MutableRefObject, SetStateAction, useEffect, useRef } from 'react'
import { SwiperSlide } from 'swiper/react';


interface IProps {
  name: string,
  socketId: string,
  audioTrack: MediaStreamTrack | null
  videoTrack: MediaStreamTrack | null
  audiosElementRef: MutableRefObject<IAudioRef>
  videosElementsRef: MutableRefObject<IVideoRef>
  socketIdRef: MutableRefObject<string | null>
  videoTrackRef: MutableRefObject<MediaStreamTrack | null>
  displayTrackRef: MutableRefObject<MediaStreamTrack | null>
  isMicMute: Boolean
  isWebCamMute: Boolean
  onClick: () => void;
  index: number;
  selected: number;
  superForceRender: number;
  isShareScreen: boolean;
}

const RenderParticipantsMobile: FC<IProps> = ({ socketId, name, videosElementsRef, audiosElementRef, socketIdRef, videoTrackRef, isMicMute, isWebCamMute, onClick, index, selected, superForceRender, displayTrackRef, isShareScreen }) => {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const setVideoRefs = (ref: HTMLVideoElement | null) => {
    videoRef.current = ref;
    if (ref) {
      videosElementsRef.current[socketId] = ref;
    }
  };

  const setAudioRefs = (ref: HTMLVideoElement | null) => {
    audioRef.current = ref;
    if (ref) {
      audiosElementRef.current[socketId] = ref;
    }
  };

  useEffect(() => {
    console.log(videoRef.current && videoTrackRef.current, videoTrackRef.current, 'ppppppp')
    if (socketIdRef.current == socketId) {
      if (videoRef.current && displayTrackRef.current) {
        videoRef.current.srcObject = new MediaStream([displayTrackRef.current])
        return
      }
      if (videoRef.current && videoTrackRef.current) {
        videoRef.current.srcObject = new MediaStream([videoTrackRef.current])
        return
      }
    }
  }, [socketId, socketIdRef.current, videoTrackRef.current, superForceRender])


  return (
 

 
      <div className={` mx-2 my-[2px] h-[10rem] bg-[#242424] shadow-xl rounded-xl flex items-center justify-center ${(selected === index && !(socketId == socketIdRef.current && isShareScreen)) ? "hidden" : "block"} relative`} onClick={onClick}>

        <video autoPlay ref={setVideoRefs} className={`absolute top left-0 right-0 bottom-0 object-cover z-0 w-full h-full ${!isWebCamMute || isShareScreen ? 'block' : 'hidden'}`}></video>

        <h1 className={`text-2xl font-semibold text-white z-10 select-none`}>{name}</h1>
        <audio ref={setAudioRefs} autoPlay></audio>

      </div>
      
  )

}

export default RenderParticipantsMobile