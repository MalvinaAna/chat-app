import { useState, useEffect } from 'react';
import { StyleSheet, View, Text, Platform, KeyboardAvoidingView } from 'react-native';
import { GiftedChat, Bubble } from 'react-native-gifted-chat';
import { collection, addDoc, onSnapshot, query, orderBy } from "firebase/firestore";

const Chat = ({ db, route, navigation }) => {

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

// useEffect to set messages options
useEffect(() => {

  if (!db) {
    console.error("Firestore database is not initialized");
    return;
  }

  navigation.setOptions({ title: name, color: backgroundColor });
  const q = query(collection(db, "messages"), orderBy("createdAt", "desc"));
  const unsubMessages = onSnapshot(q, (docs) => {
    let newMessages = [];
    docs.forEach(doc => {
      newMessages.push({
        id: doc.id,
        ...doc.data(),
        createdAt: new Date(doc.data().createdAt.toMillis())
      })
    })
    setMessages(newMessages);
  })
  return () => {
    if (unsubMessages) unsubMessages();
  }
 }, []);

 return (
  <View style={[styles.container, { backgroundColor: backgroundColor }]}>
    <GiftedChat
      messages={messages}
      renderBubble={renderBubble}
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