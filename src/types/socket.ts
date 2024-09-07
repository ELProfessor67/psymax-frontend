import { CONNECT_TRANSPORT, CONSUME, CONSUME_RESUME, CREATE_WEBRTC_TRANSPORT, GET_PRODUCERS, JOIN_ROOM, MUTE_UNMUTE, NEW_PARTCIPANT_JOIN, NEW_PRODUCER, PARTICIPANTS_DISCONNECT, PRODUCE_TRANSPORT, TRANSPORT_RECV_CONNECT } from "@/constant/events";
import ParticipantService from "@/services/partcipants";
import mediasoupClient from 'mediasoup-client'
import { RtpCapabilities, RtpParameters } from "mediasoup-client/lib/RtpParameters";

export interface ItransportPrams extends mediasoupClient.types.TransportOptions<mediasoupClient.types.AppData> {
  error?: string
}

export interface IProducerData {
  producerId: string
  socketId: string
}



export interface IConsumerParams {
  id: string
  producerId: string
  kind: "audio" | "video" | undefined
  rtpParameters: RtpParameters
  serverConsumerId: string
  error?: string
}

export interface ServerToClientEvents {
  [NEW_PARTCIPANT_JOIN]: (data: { socketId: string, username: string,isWebCamMute:Boolean,isMicMute:Boolean }) => void;
  
  [PARTICIPANTS_DISCONNECT]: (data: { socketId: string }) => void;

  [NEW_PRODUCER]: (
    data: IProducerData
  ) => void;

  [MUTE_UNMUTE]: (
    data: {
      value:Boolean
      type: 'mic' | 'cam'
      socketId: string | null
    }
  ) => void;
}

export interface ClientToServerEvents {
  [JOIN_ROOM]: (
    data: { room_id: string; username: string,isWebCamMute:Boolean,isMicMute:Boolean },
    callback: (socketId: string, rtpCapabilities: mediasoupClient.types.RtpCapabilities, participants: ParticipantService[]) => void
  ) => void;


  [CREATE_WEBRTC_TRANSPORT]: (
    data: { consumer: Boolean },
    callback: (data: { params: ItransportPrams }) => void
  ) => void;

  [CONNECT_TRANSPORT]: (data: { dtlsParameters: mediasoupClient.types.DtlsParameters }) => void;


  [PRODUCE_TRANSPORT]: (data: {
    kind: mediasoupClient.types.MediaKind,
    rtpParameters: mediasoupClient.types.RtpParameters,
    appData: mediasoupClient.types.AppData
  },
    callback: (data: { id: string, producersExist: Boolean }) => void
  ) => void;


  [GET_PRODUCERS]: (
    callback: (producerIds:IProducerData[]) => void
  ) => void;


  [TRANSPORT_RECV_CONNECT]: (
    data: {
      dtlsParameters: mediasoupClient.types.DtlsParameters
      serverConsumerTransportId:string,
    }
  ) => void;

  [CONSUME]: (
    data: {
      rtpCapabilities: mediasoupClient.types.RtpCapabilities | undefined
      remoteProducerId: string
      serverConsumerTransportId:string
    },
    callback: (data: {params:IConsumerParams}) => void
  ) => void;

  [CONSUME_RESUME]: (
    data: {
      serverConsumerId:string
    }
  ) => void;


  [MUTE_UNMUTE]: (
    data: {
      value:Boolean
      type: 'mic' | 'cam'
      socketId: string | null
    }
  ) => void;
 


}