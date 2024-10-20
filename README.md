# Chat App with React Native

## About

This project is a mobile chat application built with **React Native**. It offers users a chat interface along with the ability to share images and location data. The app is compatible with both iOS and Android devices and utilizes **Google Firestore/Firebase** for storing messages and images. User authentication is managed through **Firebase Authentication**.

## Features and Requirements

### Key Features

- **User Onboarding**: A dedicated page for users to enter their name and select a background color for the chat screen before joining the conversation.
- **Chat Interface**: A page that displays the ongoing conversation, complete with an input field and a submit button for messages.
- **Multimedia Support**: Users can send images and share their current location in the chat.
- **Data Persistence**: The app supports both online and offline data storage.

## Technologies Used

- **React Native**
- **Expo**
- **Expo ImagePicker**
- **Expo Location**
- **Google Firestore/Firebase**
- **Gifted Chat Library**
- **Android Studio**

## Dependencies

- **@react-navigation/native**: ^6.1.18
- **@react-navigation/native-stack**: ^6.11.0
- **expo**: ~51.0.28
- **expo-status-bar**: ~1.12.1
- **firebase**: ^10.3.1
- **react**: 18.2.0
- **react-native**: 0.74.5
- **react-native-gifted-chat**: ^2.6.4
- **react-native-safe-area-context**: 4.10.5
- **react-native-screens**: 3.31.1
- **@react-native-async-storage/async-storage**: 1.23.1
- **@react-native-community/netinfo**: 11.3.1
- **expo-image-picker**: ~15.0.7
- **expo-location**: ~17.0.1
- **react-native-maps**: 1.14.0

## Prerequisites

1. **Node.js**: Ensure you have Node.js installed on your machine.
2. **Google Firestore/Firebase**:
   - Create a Google account and set up a new project in Firebase.
   - Obtain your Firebase configuration code and add it to `App.js`.
   - Set up the Firestore database under the **Build** section > **Firestore Database**.
   - Activate **Storage** and modify the security rules to: 
     ```plaintext
     allow read, write: if true;
     ```

## Getting Started

To start the Expo project, run the following command:

```bash
npx expo start
