/* eslint linebreak-style: ["error", "windows"] */
import PropTypes from 'prop-types';
import React from 'react';
import {
  StyleSheet, Text, TouchableOpacity, View,
} from 'react-native';
import * as Permissions from 'expo-permissions';
import * as ImagePicker from 'expo-image-picker';
import * as Location from 'expo-location';

// Defines firebase to use as DB
const firebase = require('firebase');
require('firebase/firestore');

export default class CustomActions extends React.Component {
  // Allows user to get picture from gallery
  pickImage = async () => {
    try {
      // Requests permission to access user's gallery
      const { status } = await Permissions.askAsync(Permissions.CAMERA_ROLL);

      if (status === 'granted') {
        // Sets selected image to variable
        const result = await ImagePicker.launchImageLibraryAsync({
          mediaTypes: 'Images',
        }).catch((e) => console.log(e));
        // Sets image to display if user does not cancel upload
        if (!result.cancelled) {
          const imageUrl = await this.uploadImage(result.uri);
          this.props.onSend({ image: imageUrl });
        }
      }
    } catch (e) { console.log(e.message) }
  }

  // Allows user to take a picture and upload to firebase
  takePhoto = async () => {
    try {
      // Requests permission to access user's gallery and camera
      const { status } = await Permissions.askAsync(Permissions.CAMERA, Permissions.CAMERA_ROLL);

      if (status === 'granted') {
        // Sets selected image to variable
        const result = await ImagePicker.launchCameraAsync({
          mediaTypes: ImagePicker.MediaTypeOptions.Images,
        }).catch((e) => console.log(e));
        // Sets image to display if user does not cancel upload
        if (!result.cancelled) {
          const imageUrlLink = await this.uploadImage(result.uri);
          this.props.onSend({ image: imageUrlLink });
        }
      }
    } catch (e) { console.log(e.message) }
  }

  // Pulls user's location to send data to firebase
  getLocation = async () => {
    try {
      // Requests permission to access user's geo-location
      const { status } = await Permissions.askAsync(Permissions.LOCATION);

      if (status === 'granted') {
        // Sets location to variable
        const result = await Location.getCurrentPositionAsync({});
        // Sets variable to location if successfully obtain user's location
        if (result) {
          this.props.onSend({
            location: {
              longitude: result.coords.longitude,
              latitude: result.coords.latitude,
            },
          });
        }
      }
    } catch (e) { console.log(e.message) }
  }

  // Uploads image to firebase with XTMHttp request
  uploadImage = async (uri) => {
    try {
      // Defines blob (binary large object)
      const blob = await new Promise((resolve, reject) => {
        // Defines request type
        const xhr = new XMLHttpRequest();
        xhr.onload = () => {
          resolve(xhr.response);
        };
        xhr.onerror = (e) => {
          console.log(e);
          reject(new TypeError('Network request failed'));
        };
        xhr.responseType = 'blob';
        xhr.open('GET', uri, true);
        xhr.send(null);
      });

      // Gives unique name to each image
      const imageName = uri.split('/');

      // Defines how image is send to database
      const ref = firebase
        .storage()
        .ref()
        .child(`${imageName[0]}`);

      const snapshot = await ref.put(blob);
      blob.close();

      // Sends to database
      return await snapshot.ref.getDownloadURL();
    } catch (e) { console.log(e.message); }
  }

  // Defines what options are in the menu
  onActionsPress = () => {
    // Defines options for menu
    const options = [
      'Upload Picture',
      'Take Picture',
      'Send Location',
      'Cancel',
    ];

    // Sets cancel button
    const cancelButtonIndex = options.length - 1;

    // Sets actions/functions for each option
    this.context.actionSheet().showActionSheetWithOptions(
      {
        options,
        cancelButtonIndex,
      },
      async (buttonIndex) => {
        switch (buttonIndex) {
          case 0:
            return this.pickImage();
          case 1:
            return this.takePhoto();
          case 2:
            return this.getLocation();
          default:
        }
      },
    );
  };

  render() {
    return (
      // Sets to modifiable button
      <TouchableOpacity 
        accessible
        accessibilityLabel="Click for additional options"
        style={[styles.container]} 
        onPress={this.onActionsPress}
      >
        <View style={[styles.wrapper, this.props.wrapperStyle]}>
          <Text style={[styles.iconText, this.props.iconTextStyle]}>+</Text>
        </View>
      </TouchableOpacity>
    );
  }
}

// Styles for expandable toolbar
const styles = StyleSheet.create({
  container: {
    width: 26,
    height: 26,
    marginLeft: 10,
    marginBottom: 10,
  },
  wrapper: {
    borderRadius: 13,
    borderColor: '#b2b2b2',
    borderWidth: 2,
    flex: 1,
  },
  iconText: {
    color: '#b2b2b2',
    fontWeight: 'bold',
    fontSize: 16,
    backgroundColor: 'transparent',
    textAlign: 'center',
  },
});

// Defines actionSheet for onActionsPress function
CustomActions.contextTypes = {
  actionSheet: PropTypes.func,
};
