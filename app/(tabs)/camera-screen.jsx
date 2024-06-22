import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native'
import React, { useState } from 'react'
import * as ImagePicker from 'expo-image-picker';

const CameraScreen = () => {
  const [image, setImage] = useState('');
  const [cameraPermission, requestCameraPermission] = ImagePicker.useCameraPermissions();
  const [mediaLibraryPermission, requestMediaLibraryPermission] = ImagePicker.useMediaLibraryPermissions();

  if (!cameraPermission) {
       // Camera permissions are still loading.
       <View />;
     }
    
    
     if (!cameraPermission?.granted) {
       // Camera permissions are not granted yet.
         <View style={styles.permissionContainer}>
           <Text style={styles.permission}>Allow access to camera?</Text>
           <TouchableOpacity style={styles.permissionButton} onPress={requestCameraPermission}>
             <Text style={styles.permissionText}>Grant Camera Permission</Text>
           </TouchableOpacity>
         </View>
       
     }
    
     if (!mediaLibraryPermission) {
      // Media Library permissions are still loading.
      <View />
     }
    
     if (!mediaLibraryPermission?.granted) {
      // Media Library permissions are not granted yet. 
        <View style={styles.permissionContainer}>
           <Text style={styles.permission}>Allow access to media library?</Text>
           <TouchableOpacity style={styles.permissionButton} onPress={requestMediaLibraryPermission}>
             <Text style={styles.permissionText}>Grant Media Library Permission</Text>
           </TouchableOpacity>
         </View>
     }

  const openCamera = async () => {
    const permission = await ImagePicker.requestCameraPermissionsAsync();
    if (!permission.granted) {
      return (
        <View>
          <Text>Permission is needed to use camera</Text>
        </View>     
      );
    }
    console.log('Camera permission: ', permission.granted);

    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    console.log(result);

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  }

  const pickImage = async () => {
    // No permissions request is necessary for launching the image library
    const permission = ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) {
      <Text>Permission is needed to access media library</Text>
    }
    console.log('Media library permission: ', permission.granted);

    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    console.log(result);

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };


  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.button} onPress={openCamera}>
        <Text style={styles.buttonText}>Open Camera</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.button} onPress={pickImage}>
        <Text style={styles.buttonText}>Pick an image</Text>
      </TouchableOpacity>
      {image && <Image source={{ uri: image }} style={styles.image} />}

    </View>
  )
}

export default CameraScreen

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  button: {
    backgroundColor: "#397004",
    padding: 10,
    borderRadius: 10,
    marginBottom: 20
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 18
  },
  image: {
    width: 200,
    height: 200,
  }
})

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
