import { View, Text, StyleSheet, TouchableOpacity } from 'react-native'
import React, { useEffect, useState } from 'react'
import { db } from '../../FirebaseConfig'
import { doc, getDoc } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { BottomTabBarHeightCallbackContext } from '@react-navigation/bottom-tabs';
import { useAuth } from '../../context/authContext';



const Profile = () => {
  const [username, setUsername] = useState('');
  const auth = getAuth();
  const user = auth.currentUser;

  useEffect(() => {
    const fetchUsername = async () => {
      try {
        if (user) {
          const userDoc = doc(db, 'users', user.uid);
          const docSnap = await getDoc(userDoc);
          if (docSnap.exists()) {
            setUsername(docSnap.data().username);
          } else {
            console.log('No such document!');
          }
        }
      } catch (error) {
        console.error('Error fetching document:', error);
      }
    };

    fetchUsername();
  }, [user]);


  const { logout } = useAuth();
  const handleLogout = async ()=>{
    await logout();
  }
  

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Hi, {username}!</Text>
      </View>
      <Text style={styles.subtitle}>Achievements</Text>
      <Text style={styles.subtitle}>Photos</Text>
      <TouchableOpacity style={styles.button} onPress={handleLogout} >
        <Text style={styles.buttonText} >Logout</Text>
      </TouchableOpacity> 
      
    </View>
  )
}


export default Profile

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#E9F7EF",

  },
  header: {
    height: 150,
    paddingTop: 50,
    backgroundColor: '#397004',
    justifyContent: 'center',
    alignItems : 'center'
  },
  title: {
    fontWeight: "bold",
    fontSize: 35,
    color: "white",
  },
  subtitle: {
    fontWeight: "bold",
    fontSize: 25,
    color: '#397004',
    marginTop: 15,
    marginLeft: 10,
    marginBottom: 15
  },
  button: {
    backgroundColor: "#397004",
    padding: 15,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 100,
    width: 100,
    marginBottom: 15,
    marginTop: 15,
    marginLeft: 10
  },
  buttonText: {
    fontWeight: "bold",
    fontSize: 18,
    color: "white"
  }
});
