/* eslint linebreak-style: ['error', 'windows'] */
import React, { useState, useCallback, useEffect } from 'react'; // \n
import { View, AsyncStorage } from 'react-native';
import { GiftedChat, InputToolbar } from 'react-native-gifted-chat';
import NetInfo from '@react-native-community/netinfo';
import MapView from 'react-native-maps';
import CustomActions from './CustomActions';

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
  if (!firebase.apps.length) {
    firebase.initializeApp({
      apiKey: 'AIzaSyDoYIcYbogi7UxNPtI5B_Umyr3yaHYUgLo',
      authDomain: 'chat-app-854ee.firebaseapp.com',
      databaseURL: 'https://chat-app-854ee.firebaseio.com',
      projectId: 'chat-app-854ee',
      storageBucket: 'chat-app-854ee.appspot.com',
      messagingSenderId: '1056389705300'
    });
  }

  /**
  * Defines and pulls collection 'chat' from firebase
  * @constant
  * @type {object}
  */
  const chatLog = firebase.firestore().collection('chat');

  // Gets network status
  NetInfo.fetch().then((isConnected) => {
    // If online, sets isOnline to true, else sets to false
    isConnected ? setOnline(true) : setOnline(false)
  });

  /**
   * Function that runs on update of firebase
   * @async
   * @function onChatUpdate
   * @param {object} querySnapshot
   * @return {state} messages
  */
  const onChatUpdate = (querySnapshot) => {
    const list = [];
    if (querySnapshot) {
      // go through each document
      querySnapshot.forEach((doc) => {
        // gets the data from the documents
        let data = doc.data();
        // Pushes next item into list and translates database data
        list.push({
          _id: list.length,
          text: data.body.text,
          createdAt: data.body.createdAt.toDate(),
          user: {
            _id: data.body.user._id,
          },
          image: data.body.image || '',
          location: data.body.location,
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
        saveMessages();
      }
    }
  };

  /**
   * Pulls localStorage of messages if offline
   * @function getMessages
   * @param AsyncStorage
   * @returns {state} messages
  */
  useEffect(() => {
    getMessages();
  }, [!isOnline]);

  /**
   * Runs only when user is online and runs function onChatUpdate
   * @function unsubscribe
   * @param
   * @returns {function} onChatUpdate
   * @listens authUnsubscribe
  */
  useEffect(() => {
    // Updates view to display current chat log
    const unsubscribe = () => {
      chatLog.onSnapshot(onChatUpdate);
    };
    unsubscribe();
  }, [uid]);

  /**
  * Pulls data from props (Written to run only if userName is not defined)
  * @constant
  * @type {string} name
  * @default 'User'
  * @type {string} color
  * @default '#090C08'
  */
  useEffect(() => {
    // pulls props from previous screen
    const { name, color } = props.route.params;

    // Sets proper variables from props
    setBackground(color);
    name ? setName(name) : setName('User')

    // sets top navbar to have title of the user's entered name
    props.navigation.setOptions({ title: userName });
  }, [!userName]);

  /**
  * useEffect set to run only if user is not logged in
  * @async
  * @function authUnsubscribe
  * @param firebase
  * @returns uid (userID)
  * listens to self to prevent re-renders if ran successfully
  * @listens authUnsubscribe
  */
  useEffect(() => {
    const authUnsubscribe = firebase.auth().onAuthStateChanged(async (user) => {
      try {
        // If user is not already signed in, creates anonymous user ID
        await firebase.auth().signInAnonymously();
        // set state of userID
        setID(user.uid);
      } catch (e) { console.log(e.message); }
    });
    authUnsubscribe();
  }, [!uid]);

  /**
  * Saves messages to local storage using AsyncStorage
  * @async
  * @function saveMessages
  * @param
  * @returns {object} messages
  */
  const saveMessages = async () => {
    try {
      await AsyncStorage.setItem('messages', JSON.stringify(messages));
    } catch (e) { console.log(e.message); }
  };

  /**
  * Testing function to clear localStorage
  * Deletes messages from AsyncStorage (localStorage)
  * @async
  * @function deleteMessages
  * @param
  * @returns null
  */
  const deleteMessages = async () => {
    try {
      await AsyncStorage.removeItem('messages');
    } catch (e) { console.log(e.message); }
  };

  /**
  * Pulls messages from local storage
  * @async
  * @function getMessages
  * @param
  * @returns {object} messages
  * @default []
  */
  const getMessages = async () => {
    let data = [];
    try {
      data = await AsyncStorage.getItem('messages');
      data ? setMessages(JSON.parse(data)) : setMessages( [] )
    } catch (e) { console.log(e.data); }
  };

  /**
  * Function called on submit button
  * @function onSend
  * @param {array} data
  * @default []
  * @returns {state} GiftedChat
  * @returns {function} saveMessages
  * listens for submit button in UI
  * @listens GiftedChat
  */
  const onSend = useCallback((data = []) => {
    // Defines portion of document to send to database
    const body = data[0];
    // Adds new message to firebase
    chatLog.add({ body });
    // Adds new message to UI
    setMessages((previousMessages) => GiftedChat.append(previousMessages, messages));
    saveMessages();
  }, []);

  /**
  * Renders text-input
  * @function renderInputToolbar
  * @param {*} props
  * If/else statement returns one of the following
  * @returns {boolean} false
  * @returns {tag} <InputToolbar/>
  */
  const renderInputToolbar = (props) => {
    // If not online, will render nothing
    if (!isOnline) return false;
    // Else renders text-input
    return (
      <InputToolbar {...props}/>
    );
  };

  /**
  * UI for show location function
  * @function renderCustomView
  * @param {*} props
  * returns one of the following based on boolean
  * @returns {tag} <MapView/>
  * @returns null
  */
  const renderCustomView = (props) => {
    const {currentMessage} = props;
    // Filters through to only run on messages with location
    if (currentMessage.location) {
      return (
        <View>
          {/* Displays location on map */}
          <MapView
            // CSS for display
            style={{
              width: 150,
              height: 100,
              borderRadius: 13,
              margin: 3,
            }}
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
  };

  /**
  * Renders ./CustomActions.js (expandable options bar)
  * @function renderCustomActions
  * @param {*} props
  * @returns {tag} <CustomActions/>
  */
  const renderCustomActions = (props) => {
    return <CustomActions {...props} />;
  };

  return (
    // styling background to have color and cover the entire screen
    <View style={{ flex: 1, backgroundColor: background}}>

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
        onSend={(messages) => onSend(messages)}
        // Sets user so messages sent by this user will display on the right
        user={{ _id: uid }}
      />
    </View>
  );
}
