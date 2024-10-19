import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import Start from './components/Start';
import Chat from './components/Chat';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const Stack = createNativeStackNavigator();

const App = () => {

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyB-G5oLQBfNSMzH6kkNeqrZ1yXWP4sNHRQ",
  authDomain: "my-chat-app-4a9a9.firebaseapp.com",
  projectId: "my-chat-app-4a9a9",
  storageBucket: "my-chat-app-4a9a9.appspot.com",
  messagingSenderId: "22841810648",
  appId: "1:22841810648:web:f3a041fefb5496350a41ad"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Cloud Firestore and get a reference to the service
const db = getFirestore(app);

  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Start"
      >
        <Stack.Screen
          name="Start"
          component={Start}
        />
        <Stack.Screen
          name="Chat">
            {props => <Chat db={db} {...props}/>}
          </Stack.Screen>
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default App;
