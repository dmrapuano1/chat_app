// importing required dependencies
import React from 'react';
import SplashScreen from './components/Start';
import ChatScreen from './components/Chat';
import 'react-native-gesture-handler';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

// creates navigation for app
const Stack = createStackNavigator();

export default class App extends React.Component {

 render() {

   return (

    // creates application and which screens can be accessed while in the app
    <NavigationContainer>
      {/* sets default screen to splash screen (home) */}
      <Stack.Navigator
        initialRouteName="SplashScreen"
      >
        {/* defines screens for navigation within screens */}
        <Stack.Screen
          name="Home"
          component={SplashScreen}
        />
        <Stack.Screen
          name="ChatScreen"
          component={ChatScreen}
        />
      </Stack.Navigator>
    </NavigationContainer>
   );
 }
}
