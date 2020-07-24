// imports required dependencies
import React, { useState, useCallback, useEffect } from 'react';
import { View, Text} from 'react-native';
import { GiftedChat } from 'react-native-gifted-chat';


export default function ChatScreen(props) {
  const [messages, setMessages] = useState([]);
  const [background, setBackground] = useState([]);
  const [userName, setName] = useState([]);

  const pullProps = (( () => {
    
    // defines variables from previous screen
    let { name, color } = props.route.params;

    if (background !== color) setBackground(color)

    // sets name to 'User' if the user left this section blank
    if (!name && !userName) setName('User')
    else if (userName !== name) setName(name)

    // sets top navbar to have title of the user's entered name
    props.navigation.setOptions({ title: userName });
  }))();

  useEffect(() => {
    setMessages([
      {
        _id: 1,
        text: `Hello ${userName}`,
        createdAt: new Date(),
        user: {
          _id: 2,
          name: 'React Native',
          avatar: 'https://placeimg.com/140/140/any',
        },
      },
    ])
  }, [])

  const onSend = useCallback((messages = []) => {
    setMessages(previousMessages => 
      GiftedChat.append(previousMessages, messages))
  }, [])


  return (
    <View style={{flex:1, backgroundColor: background}}>
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