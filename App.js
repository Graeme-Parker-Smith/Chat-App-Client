import React from "react";
import { createAppContainer, createSwitchNavigator } from "react-navigation";
import { createStackNavigator } from "react-navigation-stack";
import SigninScreen from "./src/screens/SigninScreen";
import SignupScreen from "./src/screens/SignupScreen";
import AccountScreen from "./src/screens/AccountScreen";
import ResolveAuthScreen from "./src/screens/ResolveAuthScreen";
import RoomScreen from "./src/screens/RoomScreen";
import { setNavigator } from "./src/navigationRef";
import { Provider as AuthProvider } from "./src/context/AuthContext";
import { Provider as ChannelProvider } from "./src/context/ChannelContext";
import { Provider as MessageProvider } from "./src/context/MessageContext";
import { createBottomTabNavigator } from "react-navigation-tabs";
import { YellowBox } from "react-native";
window.navigator.userAgent = "react-native";
import SocketContext from "./src/context/SocketContext";
import io from "socket.io-client";
YellowBox.ignoreWarnings([
  "Accessing view manager configs directly off UIManager via UIManager['getConstants'] is no longer supported. Use UIManager.getViewManagerConfig('getConstants') instead.",
  "Unrecognized WebSocket connection option(s) `agent`, `perMessageDeflate`, `pfx`, `key`, `passphrase`, `cert`, `ca`, `ciphers`, `rejectUnauthorized`. Did you mean to put these under `headers`?"
]);

const channelFlow = createStackNavigator({
  Account: AccountScreen,
  Room: RoomScreen
});

const navigator = createSwitchNavigator({
  ResolveAuth: ResolveAuthScreen,
  Signin: SigninScreen,
  Signup: SignupScreen,
  channelFlow
});

// socket.io connection does not work when using localhost:3000 as ENDPOINT!
// enter ipconfig on terminal and use IPv4 Address instead!
// in my case it is: 192.168.1.233

// const ENDPOINT = "https://graeme-chat-app.herokuapp.com";
const ENDPOINT = "http://192.168.1.233:3000";
const socket = io(ENDPOINT);

const App = createAppContainer(navigator);
export default () => {

  return (
    <SocketContext.Provider value={socket}>
      <AuthProvider>
        <ChannelProvider>
          <MessageProvider>
            <App
              ref={navigator => {
                setNavigator(navigator);
              }}
            />
          </MessageProvider>
        </ChannelProvider>
      </AuthProvider>
    </SocketContext.Provider>
  );
};
