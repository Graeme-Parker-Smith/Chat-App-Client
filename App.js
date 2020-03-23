import React from 'react';
import { Button, Icon } from 'react-native-elements';
import { createAppContainer, createSwitchNavigator } from 'react-navigation';
import { createStackNavigator } from 'react-navigation-stack';
import SigninScreen from './src/screens/SigninScreen';
import SignupScreen from './src/screens/SignupScreen';
import AccountScreen from './src/screens/AccountScreen';
import ResolveAuthScreen from './src/screens/ResolveAuthScreen';
import RoomScreen from './src/screens/RoomScreen';
import DashScreen from './src/screens/DashScreen';
import { setNavigator, navigate, back } from './src/navigationRef';
import { Provider as AuthProvider } from './src/context/AuthContext';
import { Provider as ChannelProvider } from './src/context/ChannelContext';
import { Provider as MessageProvider } from './src/context/MessageContext';
import { createBottomTabNavigator } from 'react-navigation-tabs';
import { YellowBox } from 'react-native';
window.navigator.userAgent = 'react-native';
import SocketContext from './src/context/SocketContext';
import io from 'socket.io-client';
// YellowBox.ignoreWarnings([
// 	"Unrecognized WebSocket connection option(s) `agent`, `perMessageDeflate`, `pfx`, `key`, `passphrase`, `cert`, `ca`, `ciphers`, `rejectUnauthorized`. Did you mean to put these under `headers`?",
// 	"Accessing view manager configs directly off UIManager via UIManager['getConstants'] is no longer supported. Use UIManager.getViewManagerConfig('getConstants') instead.",
// ]);
console.disableYellowBox = true;

const channelFlow = createStackNavigator({
	Account: AccountScreen,
	Room: RoomScreen,
});
YellowBox.ignoreWarnings;

const navigator = createSwitchNavigator({
	ResolveAuth: ResolveAuthScreen,
	Signup: SignupScreen,
	Signin: SigninScreen,
	channelFlow: {
		screen: createStackNavigator(
			{
				Account: {
					screen: AccountScreen,
					navigationOptions: {
						headerShown: false,
						title: 'Account',
						headerTitleStyle: {
							color: 'white',
							textAlign: 'center',
							flexGrow: 1,
						},
					},
				},
				Room: {
					screen: RoomScreen,
					navigationOptions: {
						headerShown: false,
						// headerLeft: (
						//   <Button
						//     title="Back To Channels"
						//     onPress={() => {
						//       back("Account");
						//     }}
						//     type="clear"
						//     titleStyle={{ color: "rgba(0,122,255,1)" }}
						//   />
						// )
					},
				},
			},
			{
				initialRouteName: 'Account',
				defaultNavigationOptions: {
					headerStyle: {
						backgroundColor: 'black',
					},
				},
			}
		),
	},
	Dash: DashScreen,
});

// socket.io connection does not work when using localhost:3000 as ENDPOINT!
// enter ipconfig on terminal and use IPv4 Address instead!
// in my case it is: 192.168.1.233

// const ENDPOINT = "https://graeme-chat-app.herokuapp.com";
const ENDPOINT = 'http://192.168.1.233:3000';
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
