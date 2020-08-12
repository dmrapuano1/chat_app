// imports required dependencies
import React, { useState, useCallback, useEffect } from 'react';
import { View, Text} from 'react-native';
import { GiftedChat } from 'react-native-gifted-chat';

// calling default function with parameter of props so props are usable throughout
export default function ChatScreen(props) {

  const [messages, setMessages] = useState([]);
  const [background, setBackground] = useState([]);
  const [userName, setName] = useState([]);
  const [uid, setID] = useState([]);
  const [logText, setLogText] = useState([]);

  // Defines firebase to use as DB
  const firebase = require('firebase');
  require('firebase/firestore');

  if (!firebase.apps.length){
    firebase.initializeApp({
      apiKey: "AIzaSyDoYIcYbogi7UxNPtI5B_Umyr3yaHYUgLo",
      authDomain: "chat-app-854ee.firebaseapp.com",
      databaseURL: "https://chat-app-854ee.firebaseio.com",
      projectId: "chat-app-854ee",
      storageBucket: "chat-app-854ee.appspot.com",
      messagingSenderId: "1056389705300"
    });
  }

  function onChatUpdate (querySnapshot) {
    console.log('///////////////// In on chat update /////////////////');
    const list = [];
    // go through each document
    if (querySnapshot) {
      querySnapshot.forEach((doc) => {
        // get the QueryDocumentSnapshot's data
        var data = doc.data();
        list.push({
          _id: list.length,
          text: data.body.text,
          createdAt: data.body.createdAt.toDate(),
          user: {
            _id: data.body.userID,
            name: data.body.userName,
            avatar: 'https://placeimg.com/140/140/any'
          }
        });
      });

      if (messages.length !== list.length) {
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
        console.log(list) 
        setMessages(list)
      }
    }
  };

  // Defines and pulls collection 'chat' from firebase 
  const chatLog = firebase.firestore().collection('chat');
  
  // Updates view to display current chat log
  function unsubscribe() {
    chatLog.onSnapshot(onChatUpdate)
  }
  
  unsubscribe();

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

    const authUnsubscribe = firebase.auth().onAuthStateChanged(async (user) => {

      // If user is not already signed in, creates anonymous user ID
      if (!uid) {
      console.log('Working')
        await firebase.auth().signInAnonymously();
        // set state of userID
        setID(user.uid)
      }
  
      // set state of welcome text, unique to this user
      setLogText(`Welcome ${userName}, you have entered a chat`)
    });

    authUnsubscribe();
  }, []);

  // useEffect(() => {
  //   setMessages([
  //     {
  //       _id: 1,
  //       text: `Hello ${userName}, start sending messages by typing in the field below`,
  //       createdAt: new Date(),
  //       user: {
  //         _id: 2,
  //         name: 'React Native',
  //         avatar: 'https://placeimg.com/140/140/any',
  //       },
  //     },
  //     {
  //      _id: 2,
  //      text: logText,
  //      createdAt: new Date(),
  //      system: true,
  //     },
  //   ])
  // }, [])

  const onSend = useCallback((messages = []) => {
    let body = messages[0]
    chatLog.add({body})
    console.log('messages', messages[0])
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