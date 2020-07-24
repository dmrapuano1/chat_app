// imports required dependencies
import React, { useState, useCallback, useEffect } from 'react';
import { View, Text} from 'react-native';
import { GiftedChat } from 'react-native-gifted-chat';


export default function ChatScreen() {
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    setMessages([
      {
        _id: 1,
        text: 'Hello developer',
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
    <GiftedChat
      messages={messages}
      onSend={messages => onSend(messages)}
      user={{
        _id: 1,
      }}
    />
  )
}

// export default class ChatScreen extends React.Component {

//   constructor(props) {
//     super(props);

//     // defining state needed for app
//     this.state = { name: '', color: '', messages: '' };
//   }

//   componentDidMount() {
//     if (this.state.messages === null)
//     this.setState({
//       messages: [
//         {
//           _id: 1,
//           text: 'Hello developer',
//           createdAt: new Date(),
//           user: {
//             _id: 2,
//             name: 'React Native',
//             avatar: 'https://placeimg.com/140/140/any',
//           },
//         },
//       ],
//     })
//   }

//   onSend(messages = []) {
//     this.setState(previousState => ({
//       messages: GiftedChat.append(previousState.messages, messages),
//     }))
//   }

//   render() {
    
//     // defines variables from previous screen
//     let { name, color } = this.props.route.params;

//     // sets name to 'User' if the user left this section blank
//     if (!name || name === '') name = 'User'

//     // sets top navbar to have title of the user's entered name
//     this.props.navigation.setOptions({ title: name });

//     return (

//       // sets background color to chosen color and centers all content on page
//       <View style={{flex:1, justifyContent: 'center', alignItems: 'center', backgroundColor: color}}>
//         {/* text display as placeholder */}
//         <GiftedChat
//           messages={this.state.messages}
//           onSend={messages => this.onSend(messages)}
//           user={{
//             _id: 1,
//           }}
//         />
//       </View>
//     )
//   }
// }