import { View, Text, ActivityIndicator, StyleSheet, TouchableOpacity } from 'react-native'
import React, { useEffect, useRef } from 'react'
import { useCameraPermission, useCameraDevice, Camera } from 'react-native-vision-camera'

const CameraScreen = () => {
  const { hasPermission, requestPermission } = useCameraPermission();

  const device = useCameraDevice('back');
  const cameraRef = useRef<Camera>(null);

  useEffect(() => {
    if (!hasPermission) {
      requestPermission();
    }
  }, [hasPermission]);

  const onTakePicturePressed = async () => {
    const photo = await cameraRef.current?.takePhoto();
    console.log(photo);

  }

  if (!hasPermission) {
    return <ActivityIndicator />
  }

  if (!device) {
    return <Text style={{marginTop: 100}}>Camera device not found</Text>
  }

  return (
    <View style={styles.container}>
      <Camera 
        ref={cameraRef}
        style={StyleSheet.absoluteFill} 
        device={device} 
        isActive={true}
        photo={true}
      />
      <TouchableOpacity style={styles.button} onPress={onTakePicturePressed}>

      </TouchableOpacity>
    </View>
  )
}

export default CameraScreen

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  button: {
    position: 'absolute',
    alignSelf: 'center',
    bottom: 50,
    width: 75,
    height: 75,
    backgroundColor: 'white',
    borderRadius: 75
  }
});







// import { CameraView, useCameraPermissions, Camera, CameraType } from 'expo-camera';
// import React, { useState, useEffect, useRef } from 'react';
// import { Button, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
// import * as MediaLibrary from 'expo-media-library';

// export default function CameraScreen() {
//   const [hasCameraPermission, setHasCameraPermission] = useState(null);
//   const [image, setImage] = useState(null);
//   //const [type, setType] = useState(Camera.Constants.Type.back);
//   const [facing, setFacing] = useState('back');
//   //const [flash, setFlash] = useState(Camera.Constants.FlashMode.off);
//   const cameraRef = useRef(null);

//   useEffect(() => {
//     (async () => {
//       MediaLibrary.requestPermissionsAsync();
//       const cameraStatus = await Camera.requestCameraPermissionsAsync();
//       setHasCameraPermission(cameraStatus.status === 'granted');
//     })();
//   }, [])

//   const takePicture = async () => {
//       try {
//         if (cameraRef) {
//         const data = await cameraRef.current.takePictureAsync();
//         console.log(data);
//         setImage(data.uri);
//       }  
//     } catch (e) {
//       console.log(e);
//     } 
    
//   }

//   if (hasCameraPermission === false) {
//     return <Text>No access to camera</Text>
//   }


//   function toggleCameraFacing() {
//     setFacing(current => (current === 'back' ? 'front' : 'back'));
//   }

//   return (
//     <View style={styles.container}>
//       <CameraView style={styles.camera} facing={facing} ref={cameraRef} onCameraReady>
//         <Text>Hello</Text>

//       </CameraView>

//       <View style={styles.buttonContainer}>
//         <TouchableOpacity style={styles.button} onPress={takePicture}>
//           <Text style={styles.buttonText}>Take a picture</Text>
//         </TouchableOpacity>
//       </View>


//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: '#000',
//     //alignItems: 'center',
//     justifyContent: 'center',
//     padding: 10
//   },
//   camera: {
//     flex: 1,
//     borderRadius: 20,
//   },
//   buttonContainer: {
//     marginBottom: 120
//   },
//   button: {
//     backgroundColor: '#fff',
//     justifyContent: 'center',
//     alignItems: 'center'
//   },
//   buttonText: {
//     fontSize: 20,
//     fontWeight: 'bold'
//   }
// })


// import { Camera, useCameraPermissions, cameraType } from 'expo-camera';
// import { useState, useRef, useEffect } from 'react';
// import { Button, StyleSheet, Text, TouchableOpacity, View, Image } from 'react-native';
// import * as MediaLibrary from 'expo-media-library';


// export default function CameraScreen() {
//  const [facing, setFacing] = useState('back');
//  const [cameraPermission, requestCameraPermission] = useCameraPermissions();
//  const [mediaLibraryPermission, requestMediaLibraryPermission] = MediaLibrary.usePermissions();
//  const [hasCameraPermission, setHasCameraPermission] = useState(null);
//  const [image, setImage] = useState(null);
//  const [flash, setFlash] = useState('off');
//  const cameraRef = useRef(null);

//  if (!cameraPermission) {
//    // Camera permissions are still loading.
//    <View />;
//  }


//  if (!cameraPermission.granted) {
//    // Camera permissions are not granted yet.
//      <View style={styles.permissionContainer}>
//        <Text style={styles.permission}>Allow access to camera?</Text>
//        <TouchableOpacity style={styles.permissionButton} onPress={requestCameraPermission}>
//          <Text style={styles.permissionText}>Grant Camera Permission</Text>
//        </TouchableOpacity>
//      </View>
   
//  }

//  if (!mediaLibraryPermission) {
//   // Media Library permissions are still loading.
//   <View />
//  }

//  if (!mediaLibraryPermission.granted) {
//   // Media Library permissions are not granted yet. 
//     <View style={styles.permissionContainer}>
//        <Text style={styles.permission}>Allow access to media library?</Text>
//        <TouchableOpacity style={styles.permissionButton} onPress={requestMediaLibraryPermission}>
//          <Text style={styles.permissionText}>Grant Media Library Permission</Text>
//        </TouchableOpacity>
//      </View>
//  }


//  const toggleCameraFacing = () => {
//    setFacing(
//     current => (current === 'back' ? 'front' : 'back')
//     );
//  }

//  const toggleFlash = () => {
//   setFlash(
//     current => (current === Camera.Constants.FlashMode.off ? Camera.Constants.FlashMode.on : Camera.Constants.FlashMode.off)
//   )
//  }

//  const takePicture = async () => {
//   if (cameraRef.current) {
//     const photo = await cameraRef.current.takePictureAsync();
//     setImage(photo.uri);
//     await MediaLibrary.createAssetAsync(photo.uri);
//   }
//  }
 


//  return (
//    <View style={styles.container}>
//      <Camera style={styles.camera} facing={facing} flashMide={flash} ref={cameraRef}> 
//        <View style={styles.buttonContainer}>
//          <TouchableOpacity style={styles.button} onPress={toggleCameraFacing}>
//            <Text style={styles.text}>Flip</Text>
//          </TouchableOpacity>
//          <TouchableOpacity style={styles.button} onPress={toggleFlash}>
//             <Text style={styles.text}>Flash</Text>
//           </TouchableOpacity>
//           <TouchableOpacity style={styles.button} onPress={takePicture}>
//             <Text style={styles.text}>Capture</Text>
//           </TouchableOpacity>
//        </View>
//      </Camera>
//      {image && (
//         <View>
//           <Image source={{ uri: image }} style={styles.image}/>
//         </View>
//      )}
//    </View>
//  );
// }


// const styles = StyleSheet.create({
//  permissionContainer: {
//    flex: 1,
//    justifyContent: 'center',
//    alignItems: 'center',
//    backgroundColor: '#E9F7EF'
//  },
//  permission: {
//    fontSize: 18,
//    color: '#397004',
//    marginBottom: 5
//  },
//  permissionButton: {
//    backgroundColor: "#397004",
//    padding: 10,
//    alignItems: "center",
//    justifyContent: "center",
//    borderRadius: 100,
//    width: 200,
//    marginBottom: 15,
//    marginTop: 15,
//    marginLeft: 10
//  },
//  permissionText: {
//    fontWeight: "bold",
//    fontSize: 12,
//    color: "white"
//  },
//  container: {
//    flex: 1,
//    justifyContent: 'center'
//  },
//  camera: {
//    flex: 1,
//  },
//  buttonContainer: {
//    flex: 1,
//    flexDirection: 'row',
//    justifyContent: 'space-around',
//    backgroundColor: 'transparent',
//    margin: 64,
//  },
//  button: {
//    flex: 1,
//    alignSelf: 'flex-end',
//    alignItems: 'center',
//  },
//  text: {
//    fontSize: 24,
//    fontWeight: 'bold',
//    color: 'white',
//  },
//  imagePreview: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   image: {
//     width: '100%',
//     height: '100%',
//   },
// });
