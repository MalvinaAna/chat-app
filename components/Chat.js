import { useState, useEffect } from 'react';
import { StyleSheet, View, Text, Platform, KeyboardAvoidingView } from 'react-native';
import { GiftedChat, Bubble, InputToolbar } from 'react-native-gifted-chat';
import { collection, addDoc, onSnapshot, query, orderBy } from "firebase/firestore";
import AsyncStorage from "@react-native-async-storage/async-storage";
import CustomActions from './CustomActions';
import MapView from 'react-native-maps';



const Chat = ({ db, route, navigation, isConnected, storage }) => {

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

 const renderCustomActions = (props) => {
  return <CustomActions storage={storage} userID={userID} onSend={onSend} {...props} />;
};

const renderCustomView = (props) => {
  const { currentMessage} = props;
  if (currentMessage.location) {
    return (
        <MapView
          style={{width: 150,
            height: 100,
            borderRadius: 13,
            margin: 3}}
          region={{
            latitude: currentMessage.location.latitude,
            longitude: currentMessage.location.longitude,
            latitudeDelta: 0.0922,
            longitudeDelta: 0.0421,
          }}
        />
    );
  }
  return null;
}

// useEffect to set messages options
useEffect(() => {
  navigation.setOptions({ title: name, color: backgroundColor });
}, [name, backgroundColor]);

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
    try {
      if (doc.exists()) {
        const data = doc.data();
        newMessages.push({
          _id: doc.id,
          ...data,
          text: data.text || '',
          createdAt: data.createdAt ? new Date(data.createdAt.toMillis()) : new Date(),
          user: data.user || {},
        });
      }
    } catch (error) {
      console.error(`Error processing document ${doc.id}:`, error);
    }
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
      renderActions={renderCustomActions}
      renderCustomView={renderCustomView}
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