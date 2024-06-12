import { View, Text, StyleSheet } from 'react-native'
import React, { useEffect, useState } from 'react'
import { db } from '../../FirebaseConfig'
import { doc, getDoc } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';



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
  return (
    <View style={styles.container}>
      <Text>Username: {username}</Text>
    </View>
  )
}


export default Profile

const styles = StyleSheet.create({
  container: {
    justifyContent: "center",
    alignItems: "center",
    flex: 1,
    backgroundColor: 'white'
  }
});
