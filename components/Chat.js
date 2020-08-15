// imports required dependencies
import React, { useState, useCallback, useEffect } from 'react';
import { View } from 'react-native';
import { GiftedChat } from 'react-native-gifted-chat';
import NetInfo from '@react-native-community/netinfo';

// calling default function with parameter of props so props are usable throughout
export default function ChatScreen(props) {

  // Defining state of variables 
  const [messages, setMessages] = useState([]);
  const [background, setBackground] = useState('');
  const [userName, setName] = useState('');
  const [uid, setID] = useState('');
  const [isOnline, setOnline] = useState(false)

  console.log(uid)

  // Gets network status
  NetInfo.fetch().then(isConnected => {
    // If online, sets isOnline to true, else sets to false
    isConnected ? setOnline(true) : setOnline(false)
  });

  // Defines firebase to use as DB
  const firebase = require('firebase');
  require('firebase/firestore');

  // Defines and pulls collection 'chat' from firebase 
  const chatLog = firebase.firestore().collection('chat');

  if (!firebase.apps.length){
    console.log('Firebase')
    firebase.initializeApp({
      apiKey: "AIzaSyDoYIcYbogi7UxNPtI5B_Umyr3yaHYUgLo",
      authDomain: "chat-app-854ee.firebaseapp.com",
      databaseURL: "https://chat-app-854ee.firebaseio.com",
      projectId: "chat-app-854ee",
      storageBucket: "chat-app-854ee.appspot.com",
      messagingSenderId: "1056389705300"
    });
  }

  // Function that runs on update of firebase
  function onChatUpdate (querySnapshot) {
    console.log('///////////////// In on chat update /////////////////');
    const list = [];
    // go through each document
    if (querySnapshot) {
      querySnapshot.forEach((doc) => {
        // gets the data from the documents
        var data = doc.data();
        list.push({
          _id: list.length,
          text: data.body.text,
          createdAt: data.body.createdAt.toDate(),
          user: {
            _id: data.body.userID
          }
        });
      });

      // If/else statement to prevent multiple re-renders
      if (messages.length !== list.length) {

        // Sorts list by timestamp 
          // Database stores by random ID - this ensures messages are always sorted properly
        list.sort(function compare(a, b) {
          const timestampA = a.createdAt
          const timestampB = b.createdAt
        
          let comparison = 0;
          if (timestampA > timestampB) {
            comparison = -1;
          } else if (timestampA < timestampB) {
            comparison = 1;
          }
          return comparison;
        });

        // Sets messages to display as the list created above
        setMessages(list);
      }
    }
  };

  // Runs only when user is online
  useEffect(() => {
    // Updates view to display current chat log
    function unsubscribe() {
      chatLog.onSnapshot(onChatUpdate)
    }
    
    unsubscribe();
  }, [isOnline])

  // Pulls data from props
  useEffect(() => {
    
    // pulls props from previous screen
    let { name, color } = props.route.params;

    // sets background color - if statement to keep from infinite re-renders
    if (background !== color) setBackground(color);

    // sets name to 'User' if the user left this section blank
    if (!name && userName !== 'User') setName('User');
    
    // else sets name, done to prevent infinite re-renders
    if (userName !== name && name) setName(name);

    // sets top navbar to have title of the user's entered name
    props.navigation.setOptions({ title: userName });

  }, []);
  
  // useEffect set to run only if user is not logged in
  useEffect(() => {

    const authUnsubscribe = firebase.auth().onAuthStateChanged(async (user) => {

      // If user is not already signed in, creates anonymous user ID
      await firebase.auth().signInAnonymously();
      // set state of userID
      setID(user.uid)

    });

    authUnsubscribe();
  }, [!uid]);

  // Function called on submit button
  const onSend = useCallback((messages = []) => {
    // Defines portion of document to send to database
    let body = messages[0]
    console.log('messages', messages[0])
    // Adds new message to firebase
    chatLog.add({body})
    // Adds new message to UI
    setMessages(previousMessages => 
      GiftedChat.append(previousMessages, messages))
  }, [])

  return (
    
    // styling background to have color and cover the entire screen
    <View style={{flex:1, backgroundColor: background}}>

      {/* using react-native-gifted-chat to display and update messages in view */}
      <GiftedChat
        messages={messages}
        // calls function to update Firebase with new message
        onSend={messages => onSend(messages)}
        user={{
          _id: uid,
        }}
      />
    </View>
  )
}