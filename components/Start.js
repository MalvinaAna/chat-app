import { useState } from 'react';
import { StyleSheet, View, Text, Button, TextInput, ImageBackground, TouchableOpacity, Platform, Alert, KeyboardAvoidingView } from 'react-native';
import { getAuth, signInAnonymously } from "firebase/auth";

const Start = ({ navigation }) => {

const auth = getAuth();

 const [name, setName] = useState('');
 const [backgroundColor, setBackgroundColor] = useState("");

 const colors = ["#090C08", "#474056", "#8A95A5", "#B9C6AE"];

 // Anonymous sign-in
 const signInUser = () => {
  signInAnonymously(auth)
    .then((result) => {
      navigation.navigate("Chat", {
        name: name,
        backgroundColor: backgroundColor,
        userID: result.user.uid,
      })
      Alert.alert("Signed in successfully!");
    })
    .catch((error) => {
      Alert.alert("Unable to sign in, try later again.");
    });
};

 return (
  <View style={styles.container}>

    {/* Background image */}
    <ImageBackground
      source={require("../assets/BackgroundImage.png")}
      style={styles.backgroundImage}
    >
      <Text style={styles.appTitle}>MyChatApp</Text>
      <View style={styles.content}>
        <View style={styles.inputContainer}>

          {/* Name input */}
          <TextInput
            style={styles.textInput}
            value={name}
            onChangeText={setName}
            placeholder="Your Name"
            placeholderTextColor="#757083"
          />

          {/* Background color select */}
          <Text style={styles.textColor}>Choose Background Color:</Text>
          <View style={styles.colorContainer}>
            {colors.map((color) => (
              <TouchableOpacity
                key={color}
                style={[
                  styles.colorOption,
                  { backgroundColor: color },
                  backgroundColor === color && styles.selectedColor,
                ]}
                onPress={() => setBackgroundColor(color)}
              />
            ))}
          </View>

          {/* Start chatting button */}
          <TouchableOpacity
            style={styles.button}
            onPress={() => {
              if (name == '') {
                Alert.alert('Type a name');
              } else {
                signInUser();
              }
              }}
          >
            <Text style={styles.buttonText}>Start Chatting</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ImageBackground>
    { Platform.OS === "ios"?<KeyboardAvoidingView behavior="padding" />: null }
  </View>
);
};

const styles = StyleSheet.create({
container: {
  flex: 1,
},
backgroundImage: {
  flex: 1,
  resizeMode: "cover"
},
appTitle: {
  flex: 1,
  fontSize: 45,
  fontWeight: '600',
  color: '#FFFFFF', 
  margin: 25  
},
content: {
  flex: 1,
  justifyContent: "flex-end",
  alignItems: "center",
  paddingBottom: 10
},
inputContainer: {
  backgroundColor: "white",
  padding: 20,
  borderRadius: 10,
  width: "88%",
  alignItems: "center",
},
textInput: {
  width: "100%",
  padding: 10,
  borderWidth: 1,
  borderColor: "#757083",
  marginBottom: 10,
  fontSize: 16,
  fontWeight: "300",
  color: "#171717",
  opacity: 0.5,
},
textColor: {
  fontSize: 16,
  fontWeight: "300",
  color: "#171717",
  marginBottom: 10,
},
colorContainer: {
  flexDirection: "row",
  justifyContent: "space-between",
  width: "80%",
  marginBottom: 20,
},
colorOption: {
  width: 30,
  height: 30,
  borderRadius: 25,
},
selectedColor: {
  borderWidth: 2,
  borderColor: "#757083",
},
button: {
  backgroundColor: "#757083",
  padding: 10,
  borderRadius: 10,
},
buttonText: {
  color: "#FFFFFF",
  fontSize: 16,
  fontWeight: "600",
},
});

export default Start;