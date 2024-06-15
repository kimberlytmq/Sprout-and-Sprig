import { CameraView, useCameraPermissions } from 'expo-camera';
import { useState } from 'react';
import { Button, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import * as MediaLibrary from 'expo-media-library';


export default function Camera() {
 const [facing, setFacing] = useState('back');
 const [permission, requestPermission] = useCameraPermissions();
 const [image, setImage] = useState(null);

 if (!permission) {
   // Camera permissions are still loading.
   return <View />;
 }


 if (!permission.granted) {
   // Camera permissions are not granted yet.
   return (
     
     <View style={styles.permissionContainer}>
       <Text style={styles.permission}>Allow access to camera?</Text>
       <TouchableOpacity style={styles.permissionButton} onPress={requestPermission}>
         <Text style={styles.permissionText}>Grant Camera Permission</Text>
       </TouchableOpacity>
     </View>
   );
 }


 function toggleCameraFacing() {
   setFacing(current => (current === 'back' ? 'front' : 'back'));
 }


 return (
   <View style={styles.container}>
     <CameraView style={styles.camera} facing={facing}>
       <View style={styles.buttonContainer}>
         <TouchableOpacity style={styles.button} onPress={toggleCameraFacing}>
           <Text style={styles.text}>Flip Camera</Text>
         </TouchableOpacity>
       </View>
     </CameraView>
   </View>
 );
}


const styles = StyleSheet.create({
 permissionContainer: {
   flex: 1,
   justifyContent: 'center',
   alignItems: 'center',
   backgroundColor: '#E9F7EF'
 },
 permission: {
   fontSize: 18,
   color: '#397004',
   marginBottom: 5
 },
 permissionButton: {
   backgroundColor: "#397004",
   padding: 10,
   alignItems: "center",
   justifyContent: "center",
   borderRadius: 100,
   width: 200,
   marginBottom: 15,
   marginTop: 15,
   marginLeft: 10
 },
 permissionText: {
   fontWeight: "bold",
   fontSize: 12,
   color: "white"
 },
 container: {
   flex: 1,
   justifyContent: 'center'
 },
 camera: {
   flex: 1,
 },
 buttonContainer: {
   flex: 1,
   flexDirection: 'row',
   backgroundColor: 'transparent',
   margin: 64,
 },
 button: {
   flex: 1,
   alignSelf: 'flex-end',
   alignItems: 'center',
 },
 text: {
   fontSize: 24,
   fontWeight: 'bold',
   color: 'white',
 }
});
