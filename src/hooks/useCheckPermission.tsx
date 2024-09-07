import React, { useEffect, useState } from 'react'

const useCheckPermission = () => {
    const [cameraPermisson, setCameraPermission] = useState(false);
    const [audioPermisson, setAudioPermission] = useState(false);


    function setPermission(permissionStatus: PermissionStatus,setPermissionState:React.Dispatch<React.SetStateAction<boolean>> ){
        if (permissionStatus.state === 'granted') {
            setPermissionState(true);
          } else if (permissionStatus.state === 'denied') {
            setPermissionState(false);
          } else if (permissionStatus.state === 'prompt') {
            setPermissionState(true);
          }
    }

    async function checkCameraPermission(name:PermissionName,setPermissionState:React.Dispatch<React.SetStateAction<boolean>>) {
        try {
          // Check the status of the camera permission
          const permissionStatus = await window.navigator.permissions.query({ name });
      
          setPermission(permissionStatus,setPermissionState)
      
          // Optional: Listen for changes in permission status
          permissionStatus.onchange = () => {
            setPermission(permissionStatus,setPermissionState);
          };
        } catch (error) {
          console.error('Error checking camera permission:', error);
        }
      }

    useEffect(() => {
        checkCameraPermission('camera' as PermissionName,setCameraPermission);
        checkCameraPermission('microphone' as PermissionName,setAudioPermission);
    }, [])
    return {cameraPermisson,audioPermisson}
 
}

export default useCheckPermission