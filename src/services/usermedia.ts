
class UserMediaService {
   public audioTrack: MediaStreamTrack | null;
   public videoTrack: MediaStreamTrack | null;

   constructor(){
    this.audioTrack = null;
    this.videoTrack = null;
   }

   async getUserMedia():Promise<MediaStreamTrack[] | null[]>{
    try {
        const stream:MediaStream = await window.navigator.mediaDevices.getUserMedia({
            audio: true,
            video: {
              width: {
                min: 640,
                max: 1920,
              },
              height: {
                min: 400,
                max: 1080,
              }
            }
        });

        this.audioTrack = stream.getAudioTracks()[0];
        this.videoTrack = stream.getVideoTracks()[0];
        return [this.videoTrack,this.audioTrack]
    } catch (error:any) {
        console.log('errror while getting media: ',error.message );
        return [null,null]
    }
   
   }
}

export default UserMediaService;