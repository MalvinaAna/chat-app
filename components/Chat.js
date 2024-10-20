import { useState, useEffect } from 'react';
import { StyleSheet, View, Text, Platform, KeyboardAvoidingView } from 'react-native';
import { GiftedChat, Bubble, InputToolbar } from 'react-native-gifted-chat';
import { collection, addDoc, onSnapshot, query, orderBy } from "firebase/firestore";
import AsyncStorage from "@react-native-async-storage/async-storage";

const Chat = ({ db, route, navigation, isConnected }) => {

 const { name, backgroundColor, userID } = route.params;
 const [messages, setMessages] = useState([]);

 const onSend = (newMessages) => {
  addDoc(collection(db, "messages"), newMessages[0])
}

const renderBubble = (props) => {
  return <Bubble
    {...props}
    wrapperStyle={{
      right: {
        backgroundColor: "#000"
      },
      left: {
        backgroundColor: "#FFF"
      }
    }}
  />
}

const cacheMessages = async (messagesToCache) => {
  try {
    await AsyncStorage.setItem('messages', JSON.stringify(messagesToCache));
  } catch (error) {
     console.log(error.message);
  }
}

const loadCachedMessages = async () => {
  const cachedMessages = await AsyncStorage.getItem("messages") || [];
  setMessages(JSON.parse(cachedMessages));
}

const renderInputToolbar = (props) => {
  if (isConnected) return <InputToolbar {...props} />;
  else return null;
 }

// useEffect to set messages options
useEffect(() => {
  navigation.setOptions({ title: name, color: backgroundColor });
}, []);

let unsubMessages;

useEffect(() => {

  if (isConnected === true) {

  // unregister current onSnapshot() listener to avoid registering multiple listeners when useEffect code is re-executed.
  if (unsubMessages) unsubMessages();
  unsubMessages = null;

  const q = query(collection(db, "messages"), orderBy("createdAt", "desc"));
  unsubMessages = onSnapshot(q, (docs) => {
  let newMessages = [];
  docs.forEach(doc => {
      newMessages.push({
          id: doc.id,
          ...doc.data(),
          createdAt: new Date(doc.data().createdAt.toMillis())
      })
    })
    cacheMessages(newMessages);
    setMessages(newMessages);
    });
  } else loadCachedMessages();

  // Clean up code
  return () => {
    if (unsubMessages) unsubMessages();
  }
  }, [isConnected]);

 return (
  <View style={[styles.container, { backgroundColor: backgroundColor }]}>
    <GiftedChat
      messages={messages}
      renderBubble={renderBubble}
      renderInputToolbar={renderInputToolbar}
      onSend={messages => onSend(messages)}
      user={{
        _id: userID,
        name: name
    }}
    />
    {/* Fix that checks the device used so that the keyboard doesn't hide the message input field */}
    { Platform.OS === 'android' ? <KeyboardAvoidingView behavior="height" /> : null }
  </View>
)
}

const styles = StyleSheet.create({
 container: {
   flex: 1
 }
});

export default Chat;