# Chat App (React Native Chat Application)

This project is designed to be a chat interface for mobile devices. It uses React Native as a framework and Google Firebase as a database to connect the application on multiple devices. 

***

# Getting Started

+ Download repository from github

   See prerequisites if you do not have Expo installed already
+ Run command `expo install` in the repository
+ Download the Expo App on any mobile device

   Alternatively you can use any phone emulator capable of running the Expo Client

***

# Prerequisites

This app requires Expo and either a mobile device with the Expo App installed or an emulator capable of running the Expo App. To install Expo on your device go to your terminal and install expo-cli globally. Example:
```
npm install expo-cli --global
```

***

# Walk through

### Getting started

After everything is downloaded, cd into the project directory and run `expo install`. This will install all the necessary dependencies onto your computer. (See package.json for full list of dependencies.) Then connect your app to your own Firebase database and start the app in your browser (explained below).

### Connecting the App to Firebase

Visit [Google's Firebase website](https://firebase.google.com/) and sign in with any Google account or create one. Then, in the top right corner, click on the link labeled _Go to Console_. This should load a page with any projects you already have. To create a new one, click the button _Create Project_. Name the project a memorable name and click through the prompts until it starts to create your project. Once finished, hit the _Continue_ button. This should automatically put you inside of your new database. In the middle of the screen, there should be a prompt _"Get started by adding Firebase to your app"_. Under it, choose the "</>" to choose web based database. Name your app (same name as the project is fine). Copy the section of the code `var firebaseConfig = {...};`. This is your connection to your personal database, otherwise it will use the one originally use to create the project. Replace the code in lines 24-31 under "components/Chat.js" with the code you just copied. Once finished, click the _"Continue to Console"_ button in Google Firebase. 

### Creating your own Database

After completing the connection between the app and Firebase, in Firebase's console, click on _Develop_ on the left toolbar, then _Database_. This should bring you to a new page, click the _Create Database_ button. On the pop-up, click _Start in test mode_ to allow for easy edits, then click _Next_. Choose the region closest to yours and click _Done_. Start a new collection and name it _chat_. (You can use any name you would like, but you need to change the collection the code is looking for if you do on line 39 of "components/Chat.js"). Create your first entry by clicking _Auto-ID_ and then the _Save_ button. Note: you do not need to put anything in this entry as all entries will be auto-created by the application.

### Starting the application

Go to your terminal and run the command `expo start` to start the application. After the application fully starts, a webpage running on a local host should populate. This page gives a log of all activities, any errors, as well as the left hand side allows for use of an emulator instead of a physical mobile device. If using a physical device, a QR code should populate under the emulator options. First, ensure your device is connected to the same network as your computer, they cannot communicate otherwise. Open the Expo App and scan the QR code. This will cause expo to create a build of the code. _This may take a while._ After the build is complete, your physical device will download the code and start the application. 

***

# Built with

+ React Native
+ React Native Gifted Chat
+ Google Firebase

***

# Authors

Dominick Rapuano

***

# Acknowledgments

Built with the help of:
+ Jay Quach
+ CareerFoundry