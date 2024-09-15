import { JOIN_ROOM, MESSAGE } from "@/constant/chatEvents";

export interface ChatServerToClientEvents {
    [MESSAGE]: (data:{socketId:string,message:string,name:string}) => void;
}

export interface ChatClientToServerEvents {
    [MESSAGE]: (data:{room_id:string,text:string,name:string}) => void;
    [JOIN_ROOM]: (data:{room_id:string,name:string},callback: (id:string) => void) => void;
}