// imports required dependencies
import React from 'react';
import { View, Text} from 'react-native';


export default class ChatScreen extends React.Component {

  render() {
    
    // defines variables from previous screen
    let { name, color } = this.props.route.params;

    // sets name to 'User' if the user left this section blank
    if (!name || name === '') name = 'User'

    // sets top navbar to have title of the user's entered name
    this.props.navigation.setOptions({ title: name });

    return (

      // sets background color to chosen color and centers all content on page
      <View style={{flex:1, justifyContent: 'center', alignItems: 'center', backgroundColor: color}}>
        {/* text display as placeholder */}
        <Text style={{color: '#FFFFFF'}}>Hello {name}!</Text>
      </View>
    )
  }
}