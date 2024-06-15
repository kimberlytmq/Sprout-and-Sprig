import { Slot, useRouter, useSegments } from "expo-router";
import { useEffect } from "react";
import { AuthContextProvider, useAuth } from "../context/authContext";
import { Stack } from 'expo-router';


const MainLayout = ()=>{
  const {isAuthenticated} = useAuth();
  const segments = useSegments();
  const router = useRouter();

  
  useEffect(()=>{
    //check if user is authenticated or not
    if(typeof isAuthenticated=='undefined') return;
    const inApp = segments[0]=='(tabs)';
    if(isAuthenticated && !inApp) {
      // redirect to search
      router.replace('search');
    } else if(isAuthenticated==false) {
      // redirect to signIn
      router.replace('log-in');
    }
  }, [isAuthenticated])

  return <Slot/>
}

export default function RootLayout() {
  return (
    <AuthContextProvider>
      <MainLayout/>
    </AuthContextProvider>
  );
}
