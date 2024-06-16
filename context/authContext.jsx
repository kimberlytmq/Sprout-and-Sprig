import { createContext, useState, useContext, useEffect, userId } from "react";
import { onAuthStateChanged, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut } from "firebase/auth";
import { auth, db } from "../FirebaseConfig";
import { doc, getDoc, setDoc } from "firebase/firestore";

export const AuthContext = createContext();

export const AuthContextProvider = ({children}) => {
  const [ user, setUser ] = useState(null);
  const [isAuthenticated, setisAuthenticated] = useState(undefined);


  useEffect(() => {
    //onAuthStateChanged
    const unsub = onAuthStateChanged(auth, (user)=>{
      if(user) {
        setisAuthenticated(true);
        setUser(user);
      } else {
        setisAuthenticated(false);
        setUser(null);
      }
    });
    return unsub;
  }, [])

  const login = async (email, password) => {
    try {
      const response = await signInWithEmailAndPassword(auth, email, password);
      return {success: true}
    } catch(e) {
      let msg = e.message
      if(msg.includes('{auth/invalid-email')) msg = 'Invalid email'
      return {success: false, msg: e.message};
    }
  }

  const logout = async (email, password) => {
    try {
      await signOut(auth)
      return {success: true}

    } catch(e) {
      return {success: false, msg: e.message, errors: e};
    }
  }

  const signup = async (username, email, password, profilePicture) => {
    try {
      const response = await createUserWithEmailAndPassword(auth, email, password);
      console.log('response.user: ', response?.user);

      await setDoc(doc(db, "users", response?.user?.uid), {
        username,
        email,
        userId: response?.user?.uid,
        profilePicture
      })
      return {success: true, data: response?.user};
    } catch(e) {
      let msg = e.message
      if(msg.includes('{auth/invalid-email')) msg = 'Invalid email'
      if(msg.includes('(auth/email-already-in-use')) msg='This email is already in use'
      return {success: false, msg: e.message};
      
    }
  }

  return (
    <AuthContext.Provider value={{user, isAuthenticated, login, signup, logout}}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = ()=>{
  const value = useContext(AuthContext);

  if(!value){
    throw new Error("useAuth must be wrapped inside AuthContextProvider")
  }
  return value;

}