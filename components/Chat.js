// imports required dependencies
import React, { useState, useCallback, useEffect } from 'react';
import { View, AsyncStorage, Button } from 'react-native';
import { GiftedChat, InputToolbar } from 'react-native-gifted-chat';
import NetInfo from '@react-native-community/netinfo';
import CustomActions from './CustomActions';
import MapView from 'react-native-maps';

// calling default function with parameter of props so props are usable throughout
export default function ChatScreen(props) {

  // Defining state of variables and setState functions
  const [messages, setMessages] = useState([]);
  const [background, setBackground] = useState('');
  const [userName, setName] = useState('');
  const [uid, setID] = useState('');
  const [isOnline, setOnline] = useState('');

  // Defines firebase to use as DB
  const firebase = require('firebase');
  require('firebase/firestore');

  // If app hasn't defined the database, defines database
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

  // Defines and pulls collection 'chat' from firebase 
  const chatLog = firebase.firestore().collection('chat');

  // Gets network status
  NetInfo.fetch().then(isConnected => {
    // If online, sets isOnline to true, else sets to false
    isConnected ? setOnline(true) : setOnline(false)
  });

  // Function that runs on update of firebase
  function onChatUpdate (querySnapshot) {
    const list = [];
    if (querySnapshot) {
      // go through each document
      querySnapshot.forEach((doc) => {
        // gets the data from the documents
        var data = doc.data();
        // Pushes next item into list and translates database data
        list.push({
          _id: list.length,
          text: data.body.text,
          createdAt: data.body.createdAt.toDate(),
          user: {
            _id: data.body.user._id
          },
          image: data.body.image || '',
          location: data.body.location
        });
      });

      // If/else statement to prevent multiple re-renders
      if (messages.length !== list.length) { 
        // Sorts list by timestamp       
        list.sort(function compare(a, b) {
        const timestampA = a.createdAt
        const timestampB = b.createdAt
        // Defines to sort from oldest to newest (A > B = +1 is newest to oldest)
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

  // Pulls localStorage of messages if offline
  useEffect(() => {
    getMessages();
  }, [!isOnline])

  // Runs only when user is online (unsubscribe)
  useEffect(() => {
    // Updates view to display current chat log
    function unsubscribe() {
      chatLog.onSnapshot(onChatUpdate)
    }
    unsubscribe();
  }, [uid])

  // Pulls data from props (Written to run only if userName is not defined)
  useEffect(() => {
    
    // pulls props from previous screen
    let { name, color } = props.route.params;

    // Sets proper variables from props
    setBackground(color);
    name ? setName(name) : setName('User')

    // sets top navbar to have title of the user's entered name
    props.navigation.setOptions({ title: userName });

  }, [!userName]);
  
  // useEffect set to run only if user is not logged in (authUnsubscribe)
  useEffect(() => {
    const authUnsubscribe = firebase.auth().onAuthStateChanged(async (user) => {
      try {
        // If user is not already signed in, creates anonymous user ID
        await firebase.auth().signInAnonymously();
        // set state of userID
        setID(user.uid)
        
      } catch (e) { console.log(e.message) }
    });
    authUnsubscribe();
  }, [!uid]);

  // Saves messages to local storage (AsyncStorage)
  const saveMessages = async () => {
    try {
      await AsyncStorage.setItem('messages', JSON.stringify(messages));
    } catch (e) { console.log(e.message) }
  };

  // Testing function to clear localStorage
  const deleteMessages = async () => {
    try {
      await AsyncStorage.removeItem('messages');
    } catch (e) { console.log(e.message) }
  }

  // Pulls messages from local storage (AsyncStorage)
  const getMessages = async () => {
    let messages = [];
    try {
      messages = await AsyncStorage.getItem('messages');
      messages ? setMessages(JSON.parse(messages)) : setMessages( [] )
    } catch (e) { console.log(e.message) }
  };

  // Function called on submit button
  const onSend = useCallback((messages = []) => {
    // Defines portion of document to send to database
    let body = messages[0]
    // Adds new message to firebase
    chatLog.add({body})
    // Adds new message to UI
    setMessages(previousMessages => 
      GiftedChat.append(previousMessages, messages)
    )
    saveMessages();
  }, [])

  // Renders text-input
  function renderInputToolbar (props) {
    // If not online, will render nothing
    if (!isOnline) {
    // Else renders text-input
    } else {
      return(
        <InputToolbar
        {...props}
        />
      );
    }
  }

  // UI for show location function
  function renderCustomView (props) {
    const { currentMessage} = props;
    // Filters through to only run on messages with location
    if (currentMessage.location) {
      return (
        <View>
          {/* Displays location on map */}
          <MapView
            // CSS for display
            style={{width: 150,
              height: 100,
              borderRadius: 13,
              margin: 3}}
            region={{
              // Data from geo-location
              latitude: currentMessage.location.latitude,
              longitude: currentMessage.location.longitude,
              // Length and width of map by lat/lon
              latitudeDelta: 0.0922,
              longitudeDelta: 0.0421,
            }}
          />
        </View>
      );
    }
    // Returns no custom view if message doesn't include geo-location
    return null;
  }

  // Renders ./CustomActions.js (expandable options bar)
  function renderCustomActions (props) {
    return <CustomActions {...props} />;
  };

  return (
    
    // styling background to have color and cover the entire screen
    <View style={{flex:1, backgroundColor: background}}>

      {/* using react-native-gifted-chat to display and update messages in view */}
      <GiftedChat
        // Renders messages
        messages={messages}
        // Renders expandable options bar
        renderActions={renderCustomActions}
        // Renders map view when applicable 
        renderCustomView={renderCustomView}
        // Renders toolbar (text and options)
        renderInputToolbar={renderInputToolbar}
        // calls function to update Firebase with new message
        onSend={messages => onSend(messages)}
        // Sets user so messages sent by this user will display on the right
        user={{ _id: uid }}
      />
    </View>
  )
}