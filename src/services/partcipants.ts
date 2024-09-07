

class ParticipantService {
    public name:string;
    public socketId:string;
    public audioTrack:MediaStreamTrack | null;
    public videoTrack:MediaStreamTrack | null;
    public isMicMute: Boolean;
    public isWebCamMute: Boolean;

    constructor(name:string,socketId:string,isWebCamMute:Boolean=true,isMicMute:Boolean=true){
        this.name = name;
        this.socketId = socketId;
        this.audioTrack = null;
        this.videoTrack = null;
        this.isMicMute = isMicMute;
        this.isWebCamMute = isWebCamMute;
    }


}

export default ParticipantService;