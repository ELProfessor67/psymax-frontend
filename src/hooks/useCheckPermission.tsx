import React, { Dispatch, SetStateAction, useEffect, useState } from 'react'

const useCheckPermission = (setPermisstionOpen:Dispatch<SetStateAction<boolean>>) => {
    const [cameraPermisson, setCameraPermission] = useState(false);
    const [audioPermisson, setAudioPermission] = useState(false);
    const [cameraPermissonStatus, setCameraPermissionStatus] = useState('prompt');
    const [audioPermissonStatus, setAudioPermissionStatus] = useState('prompt');
    


    function setPermission(permissionStatus: PermissionStatus,setPermissionState:React.Dispatch<React.SetStateAction<boolean>>,setPermissionStatusState:React.Dispatch<React.SetStateAction<string>> ){
        if (permissionStatus.state === 'granted') {
            setPermissionState(true);
          } else if (permissionStatus.state === 'denied') {
            setPermissionState(false);
            setPermisstionOpen(true)
          } else if (permissionStatus.state === 'prompt') {
            setPermissionState(true);
          }
    }

    async function checkCameraPermission(name:PermissionName,setPermissionState:React.Dispatch<React.SetStateAction<boolean>>,setPermissionStatusState:React.Dispatch<React.SetStateAction<string>>) {
        try {
          // Check the status of the camera permission
          const permissionStatus = await window.navigator.permissions.query({ name });
      
          setPermission(permissionStatus,setPermissionState,setPermissionStatusState)
      
          // Optional: Listen for changes in permission status
          permissionStatus.onchange = () => {
            setPermission(permissionStatus,setPermissionState,setPermissionStatusState);
          };
        } catch (error) {
          console.error('Error checking camera permission:', error);
        }
      }

    useEffect(() => {
        checkCameraPermission('camera' as PermissionName,setCameraPermission,setCameraPermissionStatus);
        checkCameraPermission('microphone' as PermissionName,setAudioPermission,setAudioPermissionStatus);
    }, [])
    return {cameraPermisson,audioPermisson,cameraPermissonStatus,audioPermissonStatus}
 
}

export default useCheckPermission