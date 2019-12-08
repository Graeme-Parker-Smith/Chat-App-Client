import React, { useState, useEffect } from "react";
import { createAppContainer, createSwitchNavigator } from "react-navigation";
import { createStackNavigator } from "react-navigation-stack";
import SigninScreen from "./src/screens/SigninScreen";
import SignupScreen from "./src/screens/SignupScreen";
import AccountScreen from "./src/screens/AccountScreen";
import ResolveAuthScreen from "./src/screens/ResolveAuthScreen";
import { setNavigator } from "./src/navigationRef";
import { Provider as AuthProvider } from "./src/context/AuthContext";
import { FontAwesome } from "@expo/vector-icons";
import { createBottomTabNavigator } from "react-navigation-tabs";
import { StyleSheet, Text, View, YellowBox } from "react-native";
window.navigator.userAgent = "react-native";
import io from "socket.io-client";
// console.ignoredYellowBox = ['Remote debugger'];
YellowBox.ignoreWarnings([
  "Accessing view manager configs directly off UIManager via UIManager['getConstants'] is no longer supported. Use UIManager.getViewManagerConfig('getConstants') instead.",
  "Unrecognized WebSocket connection option(s) `agent`, `perMessageDeflate`, `pfx`, `key`, `passphrase`, `cert`, `ca`, `ciphers`, `rejectUnauthorized`. Did you mean to put these under `headers`?"
]);

let socket;

const navigator = createSwitchNavigator({
  ResolveAuth: ResolveAuthScreen,
  Signin: SigninScreen,
  Signup: SignupScreen,
  Account: AccountScreen
});

const App = createAppContainer(navigator);

export default () => {
  const [name, setName] = useState("Billy");
  // socket.io connection does not work when using localhost:3000 as ENDPOINT!
  // enter ipconfig on terminal and use IPv4 Address instead!
  // in this case it is: 192.168.1.233

  const ENDPOINT = "https://graeme-chat-app.herokuapp.com";
  

  useEffect(() => {
    console.log("JOINING!!!");

    socket = io(ENDPOINT);

    socket.emit("join", { name: "g", room: "g" }, error => {
      if (error) {
        alert(error);
      }
    });
  }, []);
  return (
    <AuthProvider>
      <App
        ref={navigator => {
          setNavigator(navigator);
        }}
      />
    </AuthProvider>
  );
};
