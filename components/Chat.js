// imports required dependencies
import React, { useState, useCallback, useEffect } from 'react';
import { View, Text} from 'react-native';
import { GiftedChat } from 'react-native-gifted-chat';

// calling default function with parameter of props so props are usable throughout
export default function ChatScreen(props) {
  const [messages, setMessages] = useState([]);
  const [background, setBackground] = useState([]);
  const [userName, setName] = useState([]);

  // IIFE to set props to variables
  const pullProps = (( () => {
    
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

  }))();

  useEffect(() => {
    setMessages([
      {
        _id: 1,
        text: `Hello ${userName}, start sending messages by typing in the field below`,
        createdAt: new Date(),
        user: {
          _id: 2,
          name: 'React Native',
          avatar: 'https://placeimg.com/140/140/any',
        },
      },
      {
       _id: 2,
       text: `Welcome ${userName}, you have entered a chat`,
       createdAt: new Date(),
       system: true,
      },
    ])
  }, [])

  const onSend = useCallback((messages = []) => {
    setMessages(previousMessages => 
      GiftedChat.append(previousMessages, messages))
  }, [])

  return (
    // styling background to have color and cover the entire screen
    <View style={{flex:1, backgroundColor: background}}>

      {/* using react-native-gifted-chat to display and update messages in view */}
      <GiftedChat
        messages={messages}
        onSend={messages => onSend(messages)}
        user={{
          _id: 1,
        }}
      />
    </View>
  )
}