import React from 'react';
import { YellowBox, StatusBar, Platform, View, Dimensions } from 'react-native';
import { Constants } from 'expo';
import { Button, Icon } from 'react-native-elements';
import { createAppContainer, createSwitchNavigator } from 'react-navigation';
import { createStackNavigator } from 'react-navigation-stack';
import SigninScreen from './src/screens/SigninScreen';
import SignupScreen from './src/screens/SignupScreen';
import AccountScreen from './src/screens/AccountScreen';
import ResolveAuthScreen from './src/screens/ResolveAuthScreen';
import RoomScreen from './src/screens/RoomScreen';
import DashScreen from './src/screens/DashScreen';
// import EditUserScreen from './src/screens/EditUserScreen';
import { setNavigator, navigate, back } from './src/navigationRef';
import { Provider as AuthProvider } from './src/context/AuthContext';
import { Provider as ChannelProvider } from './src/context/ChannelContext';
import { Provider as MessageProvider } from './src/context/MessageContext';
import { createBottomTabNavigator, createMaterialTopTabNavigator } from 'react-navigation-tabs';
window.navigator.userAgent = 'react-native';
import SocketContext from './src/context/SocketContext';
import io from 'socket.io-client';
import { FontAwesome, Entypo, MaterialCommunityIcons } from '@expo/vector-icons';
// YellowBox.ignoreWarnings([
// 	"Unrecognized WebSocket connection option(s) `agent`, `perMessageDeflate`, `pfx`, `key`, `passphrase`, `cert`, `ca`, `ciphers`, `rejectUnauthorized`. Did you mean to put these under `headers`?",
// 	"Accessing view manager configs directly off UIManager via UIManager['getConstants'] is no longer supported. Use UIManager.getViewManagerConfig('getConstants') instead.",
// ]);
console.disableYellowBox = true;

// const channelFlow = createStackNavigator({
// 	Account: AccountScreen,
// 	Room: RoomScreen,
// });
YellowBox.ignoreWarnings;

const navigator = createSwitchNavigator({
	ResolveAuth: ResolveAuthScreen,
	Signup: SignupScreen,
	Signin: SigninScreen,
	// EditUser: {
	// 	screen: EditUserScreen,
	// 	navigationOptions: {
	// 		headerShown: false,
	// 		title: 'edit_user',
	// 	},
	// },
	channelFlow: {
		screen: createMaterialTopTabNavigator(
			{
				Dash: {
					screen: DashScreen,
					navigationOptions: {
						headerShown: false,
						title: 'User',
						tabBarIcon: ({tintColor}) => (
							<Entypo name="user" size={25} color="#0af" />
						)
					},
				},
				Account: {
					screen: AccountScreen,
					navigationOptions: {
						headerShown: false,
						title: 'Channels',
						tabBarIcon: ({tintColor}) => (
							<FontAwesome name="home" size={25} color="#0af" />
						)
					},
				},
				Room: {
					screen: RoomScreen,
					navigationOptions: {
						headerShown: false,
						tabBarIcon: ({tintColor}) => (
							<MaterialCommunityIcons name="chat" size={25} color="#0af" />
						)
					},
				},
			},
			{
				initialRouteName: 'Account',
				// tabBarComponent: null,
				lazy: true,
				tabBarOptions: { style: { backgroundColor: '#000' }, showIcon: true, showLabel: false, activeTintColor: "#FFF" },
				style: { paddingTop: StatusBar.currentHeight || 30, backgroundColor: '#000' },
				// initialLayout: { width: Dimensions.get('window').width },
				// not compatible with lazy loading
				defaultNavigationOptions: {
					headerStyle: {
						backgroundColor: 'red',
					},
				},
			}
		),
	},
});

// socket.io connection does not work when using localhost:3000 as ENDPOINT!
// enter ipconfig on terminal and use IPv4 Address instead!
// in my case it is: 192.168.1.233

const ENDPOINT = 'https://graeme-chat-app.herokuapp.com';
// const ENDPOINT = 'http://192.168.1.233:3000';
const socket = io(ENDPOINT);
const App = createAppContainer(navigator);
export default () => {
	return (
		<SocketContext.Provider value={socket}>
			<AuthProvider>
				<ChannelProvider>
					<MessageProvider>
						<App
							ref={(navigator) => {
								setNavigator(navigator);
							}}
						/>
					</MessageProvider>
				</ChannelProvider>
			</AuthProvider>
		</SocketContext.Provider>
	);
};
