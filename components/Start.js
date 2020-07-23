// importing required dependencies from react and react-native
import React from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, ImageBackground } from 'react-native';

// importing image from assets
const image = require('../assets/Background_Image.png')

export default class SplashScreen extends React.Component {
 
  constructor(props) {
    super(props);

    // defining state needed for app
    this.state = { name: '', color: '' };
  }

  render() {
    
    // creating an array of color options for ease to change if needed
    const colorOptions = ['#090C08', '#474056', '#8A95A5', '#B9C6AE']

    // setting default of color in case user does not select one
    this.setState({ color: colorOptions[0] })

    return (

      // setting background image
      <ImageBackground source={image} style={styles.image}>

        {/* placing title */}
        <Text style={styles.title}>
          Chat App
        </Text>

        {/* creating the white box for the bottom of app */}
        <View style={styles.box}>

          <TextInput
            style={styles.input}
            // setting state of name as user's entry in text input
            onChangeText={(name) => this.setState({ name })}
            // displaying what the user has entered
            value={this.state.name}
            // prompt to user so they understand what the input box is for
            placeholder='Your Name'
          />

          <View style={styles.textBox}>
            <Text style={styles.colorPrompt}>Choose a Background Color:</Text>
          </View>

          <View style={styles.choiceBox}>
            {/* color options, 1 of 4
            displays as circle for user to select like button */}
            <TouchableOpacity
            // setting state of color to user's choice. Pulls colors from array above
              onPress={() => this.setState({ color: colorOptions[0] }) }
              style={[ styles.colorSelector, {backgroundColor: colorOptions[0]} ]}
            />
            <TouchableOpacity
              onPress={() => this.setState({ color: colorOptions[1] }) }
              style={[ styles.colorSelector, {backgroundColor: colorOptions[1]} ]}
            />
            <TouchableOpacity
              onPress={() => this.setState({ color: colorOptions[2] }) }
              style={[ styles.colorSelector, {backgroundColor: colorOptions[2]} ]}
            />
            <TouchableOpacity
              onPress={() => this.setState({ color: colorOptions[3] }) }
              style={[ styles.colorSelector, {backgroundColor: colorOptions[3]} ]}
            />
          </View>

          <View style={styles.chatButton}>
            {/* creating button with no default styles to have more freedom to style */}
            <TouchableOpacity
              // giving button ability to navigate when pressed. Note within leading tag
              onPress={() => this.props.navigation.navigate('ChatScreen', { name: this.state.name, color:this.state.color })}
            >
              {/* styling and setting button text */}
              <Text style={styles.buttonText}>Start Chatting</Text>
            </TouchableOpacity>
          </View>

        </View>
      </ImageBackground>
    )
  }
}

// creating styles in one location so it is easy to change as needed
const styles = StyleSheet.create({

  image: {
    flex: 1,
    resizeMode: "cover",
    justifyContent: "center"
  },

  title: {
    flex: 1,
    fontSize: 45,
    fontWeight: '600',
    color: '#FFFFFF',
    alignSelf: 'center',
    marginTop: 44
  },

  box: {
    flex: 1,
    backgroundColor: 'white',
    height: '44%',
    width: '88%',
    alignItems: 'center',
    alignSelf: 'center',
    // most margins are percent to compensate for larger/smaller screens to have correct styling
    marginBottom: '2%'
  },

  input: {
    fontSize: 16,
    fontWeight: '300',
    color: '#757083',
    opacity: 50,
    borderWidth: 1.5,
    borderColor: '#757083',
    borderRadius: 3,
    width: '88%',
    height: '21%',
    marginBottom: '5%',
    marginTop: '5%',
    paddingLeft: 32,
  },

  textBox: {
    alignSelf: 'flex-start',
    flex: 1,
    width: '88%',
    paddingLeft: 24,
    paddingBottom: '2%'
  },

  colorPrompt: {
    fontSize: 16,
    fontWeight: '300',
    color: '#757083',
    opacity: 100,
  },
  
  choiceBox: {
    flex: 4,
    flexDirection: 'row',
    alignSelf: 'flex-start',
    width: '80%',
    justifyContent: 'space-around',
    paddingLeft: 16,
    marginTop: '2%'
  },

  colorSelector: {
    position: 'relative',
    height: 40,
    width: 40,
    // creating circle using borderRadius
    borderRadius: 50,
    margin: 2,
    borderColor: 'white'
  },

  chatButton: {
    backgroundColor: '#757083',
    width: '88%',
    marginBottom: '5%',
    height: '21%',
    alignItems: 'center',
  },
  
  buttonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
    // set margin because button is a set size
    marginTop: 16
  }
})