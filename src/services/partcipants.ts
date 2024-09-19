

class ParticipantService {
    public name:string;
    public socketId:string;
    public audioTrack:MediaStreamTrack | null;
    public videoTrack:MediaStreamTrack | null;
    public isMicMute: boolean;
    public isWebCamMute: boolean;
    public isShareScreen: boolean;

    constructor(name:string,socketId:string,isWebCamMute:boolean=true,isMicMute:boolean=true,isShareScreen=false){
        this.name = name;
        this.socketId = socketId;
        this.audioTrack = null;
        this.videoTrack = null;
        this.isMicMute = isMicMute;
        this.isWebCamMute = isWebCamMute;
        this.isShareScreen = isShareScreen;
    }


}

export default ParticipantService;