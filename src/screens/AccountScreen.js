import React, { useContext, useState, useEffect, useRef } from 'react';
import {
	View,
	Image,
	StyleSheet,
	Text,
	FlatList,
	TouchableOpacity,
	Dimensions,
	AppState,
	Animated,
	Keyboard,
	Platform,
	StatusBar,
} from 'react-native';
import { Button, Input } from 'react-native-elements';
import { SafeAreaView, NavigationEvents } from 'react-navigation';
import { Context as AuthContext } from '../context/AuthContext';
import { Context as ChannelContext } from '../context/ChannelContext';
import SocketContext from '../context/SocketContext';
import { FontAwesome, Entypo, MaterialCommunityIcons } from '@expo/vector-icons';
import registerForNotifications from '../services/push_notifications';
import Spacer from '../components/Spacer';
import LoadingIndicator from '../components/LoadingIndicator';
import FormHandler from '../components/FormHandler';
import ChannelList from '../components/ChannelList';
import UserPanel from '../components/UserPanel';
import AnimSearchBar from '../components/AnimSearchBar';
import WhiteText from '../components/WhiteText';
import { Notifications } from 'expo';
import { navigate, back } from '../navigationRef';
import MasonImage from '../components/MasonImage';
// import Constants from 'expo-constants';

const AccountScreen = ({ navigation }) => {
	// console.log('CONSTANTS', Constants.nativeAppVersion);
	// console.log('CONSTANTS', Constants.nativeBuildVersion);
	const { signout } = useContext(AuthContext);
	const { state, fetchChannels, updateState, addFriend, clearState, refreshChannelsData, applyFilter } = useContext(
		ChannelContext
	);
	const [formState, setFormState] = useState('');
	const [isLoading, setIsLoading] = useState(false);
	const [channelSearch, setChannelSearch] = useState('');
	const [activeLists, setActiveLists] = useState({ public: true, private: true });
	const [filter, setFilter] = useState('msg');
	const [publicWidthAnim] = useState(new Animated.Value(Dimensions.get('window').width * 0.5));
	const [privateWidthAnim] = useState(new Animated.Value(Dimensions.get('window').width * 0.5));

	const [keyboardHeight, setKeyboardHeight] = useState(0);

	// const [publicActive, setPublicActive] = useState(true);
	// const [privateActive, setPrivateActive] = useState(true);

	const socket = useContext(SocketContext);

	const hasMountedRef = useRef(false);
	const firstRef = useRef(true);
	console.log('ACCOUNT RENDERING');

	useEffect(() => {
		console.log("formState changed.")
		if (hasMountedRef.current && !firstRef.current) {
			tryFetchChannels();
			console.log("formstate submit fetching channels")
			socket.emit('get_channels_data', { socketId: socket.id });
		}
	}, [formState]);

	useEffect(() => {
		keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', _keyboardDidShow);
		keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', _keyboardDidHide);

		return () => {
			keyboardDidShowListener.remove();
			keyboardDidHideListener.remove();
		};
	}, []);

	useEffect(() => {
		if (state.currentUser) {
			socket.emit('register_socket', { userId: state.currentUser._id });
		}

		socket.on('update_user', ({ newData }) => {
			updateState(newData);
			// update state on add and remove friends, invite/kick from room, pm/unread msgs
		});
		socket.on('channelsData', ({ channelsData }) => {
			// console.log('received channelsData!', channelsData);
			refreshChannelsData({ channelsData });
		});
		socket.on('invite', async ({ roomName, invitee }) => {
			await fetchChannels();
			socket.emit('get_channels_data', { socketId: socket.id });
		});

		return () => {
			// console.log('unmounting accountscreen');
			socket.emit('disconnect');
			socket.off();
		};
	}, [state]);

	useEffect(() => {
		if (hasMountedRef.current && firstRef.current) {
			(async () => {
				// console.log('state.currentUser', state.currentUser);
				let r = await registerForNotifications({ user: state.currentUser });
				if (r === 'no userData received') signout(false);
				_notificationSubscription = Notifications.addListener(_handleNotification);
			})();
			firstRef.current = false;
		} else if (firstRef.current) {
			hasMountedRef.current = true;
		}
	}, [state]);

	const _handleNotification = (notification) => {
		// do whatever you want to do with the notification
		// console.log('Notification Incoming! ', notification);
		if (notification && notification.data.destination) {
			navigate(notification.data.destination, { initialIndex: notification.data.initialIndex });
		}
	};

	const _keyboardDidShow = (e) => {
		setKeyboardHeight(e.endCoordinates.height);
	};

	const _keyboardDidHide = () => {
		setKeyboardHeight(0);
	};

	const handleClick = (action, item = { name: '', avatar: '' }) => {
		setFormState({ show: action, item });
	};

	const tryFetchChannels = async () => {
		// console.log('tryFetchChannels');
		const response = await fetchChannels();
		if (!response || response.error || response.error === null) {
			// console.log('error. signing out.');
			clearState();
			signout(false);
		} else {
			console.log("applying filter.")
			applyFilter(filter);
			socket.emit('get_channels_data', { socketId: socket.id });
		}
	};

	const handleSignout = () => {
		signout({ user_id: state.currentUser._id });
		clearState();
	};

	// handle list animations

	const handleListButton = (listType) => {
		if (listType === 'public') {
			if (publicWidthAnim._value > 0) {
				setActiveLists({ public: false, private: true });
				// togglePublic();
				Animated.timing(publicWidthAnim, {
					toValue: 0,
					duration: 500,
				}).start();
				Animated.timing(privateWidthAnim, {
					toValue: Dimensions.get('window').width * 0.9,
					duration: 500,
				}).start();
			} else {
				setActiveLists({ ...activeLists, public: true });
				// togglePublic();
				Animated.timing(publicWidthAnim, {
					toValue: Dimensions.get('window').width * (privateWidthAnim._value > 0 ? 0.5 : 0.9),
					duration: 500,
				}).start();
				Animated.timing(privateWidthAnim, {
					toValue: Dimensions.get('window').width * (privateWidthAnim._value > 0 ? 0.5 : 0),
					duration: 500,
				}).start();
			}
		} else if (listType === 'private') {
			if (privateWidthAnim._value > 0) {
				setActiveLists({ public: true, private: false });
				Animated.timing(privateWidthAnim, {
					toValue: 0,
					duration: 500,
				}).start();
				Animated.timing(publicWidthAnim, {
					toValue: Dimensions.get('window').width * 0.9,
					duration: 500,
				}).start();
				// togglePrivate();
			} else {
				setActiveLists({ ...activeLists, private: true });
				Animated.timing(privateWidthAnim, {
					toValue: Dimensions.get('window').width * (publicWidthAnim._value > 0 ? 0.5 : 0.9),
					duration: 500,
				}).start();
				Animated.timing(publicWidthAnim, {
					toValue: Dimensions.get('window').width * (publicWidthAnim._value > 0 ? 0.5 : 0),
					duration: 500,
				}).start();
				// togglePrivate();
			}
		}
	};

	const handleFilterButton = (filterType) => {
		setFilter(filterType);
		applyFilter(filterType);
	};

	// const NavigationContainer = (props) => {
	// 	return (
	// 		// <View style={styles.navigationContainer}>
	// 		<View>
	// 			<StatusBar />
	// 			{/* <View style={{paddingTop: Platform.OS === 'ios' ? 10 : 0}} /> */}
	// 			{props.children}
	// 		</View>
	// 		// </View>
	// 	);
	// };

	const handleOnBlur = async () => {
		// console.log('blurring accountscreen...');
		socket.emit('disconnect');
		socket.off();
		keyboardDidShowListener.remove();
		keyboardDidHideListener.remove();
	};

	if (!state.currentUser || isLoading) {
		return (
			<View>
				<NavigationEvents onWillFocus={tryFetchChannels} />
				<LoadingIndicator />
			</View>
		);
	}

	if (formState) {
		return <FormHandler formState={formState} setFormState={setFormState} setIsLoading={setIsLoading} />;
	}
	return (
		// <View style={{ paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0 }}>
		<>
			{/* <NavigationContainer> */}
			<NavigationEvents onWillFocus={tryFetchChannels} onWillBlur={handleOnBlur} />
			<SafeAreaView forceInset={{ top: 'always' }} style={styles.container}>
				{/* <View style={styles.userDisplay}> */}
				{/* <View style={{ flexDirection: 'row' }}> */}
				{/* <View style={{ width: Dimensions.get('window').width * 0.4 }}>
							<Text style={styles.userTitle}>{state.currentUser.username}</Text>
							<TouchableOpacity
								onPress={handleSignout}
								style={{
									backgroundColor: 'transparent',
									borderWidth: 1,
									borderColor: '#0af',
									padding: 10,
									borderRadius: 2,
									margin: 10,
								}}
							>
								<WhiteText style={{ color: '#0af', alignSelf: 'center', fontWeight: 'bold' }}>
									Sign Out
								</WhiteText>
							</TouchableOpacity>
						</View>
					</View>
					<View style={{ alignSelf: 'center' }}>
						<UserPanel user={state.currentUser} handleClick={handleClick} />
					</View> */}

				{/* </View> */}
				{/* <Spacer> */}
				<View>
					<AnimSearchBar
						placeholder="Channel Search"
						value={channelSearch}
						onChangeText={setChannelSearch}
						autoFocus={false}
						autoCapitalize="none"
						autoCorrect={false}
						inputStyle={{ color: 'white' }}
					/>
				</View>
				{/* <Image
					style={{ height: 200, width: 200 }}
					source={{
						uri:
							'file:///var/mobile/Containers/Data/Application/A85F4FD3-1330-4EF3-9C4F-F80BCDA14568/Library/Caches/ExponentExperienceData/%2540graemesmith%252Fjaded/Z1MUPbk.gif',
					}}
				/> */}
				{/* <MasonImage
					style={{ height: 200, width: 200 }}
					source={{
						uri: 'https://res.cloudinary.com/jaded/image/upload/v1598819741/ltuuouyqw11ynmwazmmy.gif',
					}}
					title="goofy"
				/> */}
				{/* <Image
					style={{ height: 200, width: 200 }}
					source={{
						uri: 'https://res.cloudinary.com/jaded/image/upload/v1598819741/ltuuouyqw11ynmwazmmy.gif',
					}}
				/> */}
				{/* </Spacer> */}
				<Spacer>
					{/* <View>
			<Text style={{color: 'white'}}>{}</Text>
					</View> */}
					<View style={{ flexDirection: 'row', justifyContent: 'space-around', marginBottom: 10 }}>
						<TouchableOpacity
							// buttonStyle={{ height: 24, width: 24 }}
							// containerStyle={{ fontSize: 6 }}
							style={{
								height: 36,
								borderRadius: 4,
								padding: 6,
								alignItems: 'center',
								justifyContent: 'center',
								backgroundColor: filter === 'new' ? '#0af' : 'black',
								borderColor: '#0af',
								borderWidth: 1,
							}}
							// type={publicWidthAnim._value > 0 ? 'solid' : 'outline'}
							// type={filter === 'new' ? 'solid' : 'outline'}
							onPress={() => handleFilterButton('new')}
						>
							<Text style={{ fontSize: 12, color: filter === 'new' ? 'white' : '#0af' }}>New</Text>
						</TouchableOpacity>
						<TouchableOpacity
							onPress={() => handleFilterButton('old')}
							style={{
								height: 36,
								borderRadius: 4,
								padding: 6,
								alignItems: 'center',
								justifyContent: 'center',
								backgroundColor: filter === 'old' ? '#0af' : 'black',
								borderColor: '#0af',
								borderWidth: 1,
							}}
						>
							<Text style={{ fontSize: 12, color: filter === 'old' ? 'white' : '#0af' }}>Old</Text>
						</TouchableOpacity>
						{/* <Button
						title="Old"
						// type={privateWidthAnim._value > 0 ? 'solid' : 'outline'}
						type={activeLists.private ? 'solid' : 'outline'}
						onPress={() => handleFilterButton('old')}
					/> */}
						<TouchableOpacity
							onPress={() => handleFilterButton('msg')}
							style={{
								height: 36,
								borderRadius: 4,
								padding: 6,
								alignItems: 'center',
								justifyContent: 'center',
								backgroundColor: filter === 'msg' ? '#0af' : 'black',
								borderColor: '#0af',
								borderWidth: 1,
							}}
						>
							<MaterialCommunityIcons
								name="message-text"
								color={filter === 'msg' ? 'black' : '#0af'}
								size={24}
								style={{ alignSelf: 'center', marginLeft: 0 }}
								// onPress={() => handleFilterButton('msg')}
							/>
						</TouchableOpacity>
						{/* <MaterialCommunityIcons
						name="star"
						color="#0af"
						size={24}
						style={{ alignSelf: 'center', marginLeft: 10 }}
						onPress={() => handleClick('create_private')}
					/> */}
					</View>
					<View style={{ flexDirection: 'row', justifyContent: 'space-around' }}>
						<Button
							title="Public"
							// type={publicWidthAnim._value > 0 ? 'solid' : 'outline'}
							type={activeLists.public ? 'solid' : 'outline'}
							onPress={() => handleListButton('public')}
						/>
						<MaterialCommunityIcons
							name="comment-plus"
							color="#0af"
							size={48}
							style={{ alignSelf: 'center', marginLeft: 10 }}
							onPress={() => handleClick('create_public')}
						/>
						<Button
							title="Private"
							// type={privateWidthAnim._value > 0 ? 'solid' : 'outline'}
							type={activeLists.private ? 'solid' : 'outline'}
							onPress={() => handleListButton('private')}
						/>
						<MaterialCommunityIcons
							name="comment-plus"
							color="#FF8100"
							size={48}
							style={{ alignSelf: 'center', marginLeft: 10 }}
							onPress={() => handleClick('create_private')}
						/>
					</View>
				</Spacer>
				<View
					style={[styles.channelDivider, { height: Dimensions.get('window').height * 0.62 - keyboardHeight }]}
				>
					<Animated.View style={{ width: publicWidthAnim }}>
						<ChannelList
							listData={state.channels}
							PMs={[]}
							channelType="public"
							navigation={navigation}
							currentUser={state.currentUser}
							handleEditChannel={handleClick}
							channelSearch={channelSearch}
							publicWidthAnim={publicWidthAnim}
							privateWidthAnim={privateWidthAnim}
							// showLists={showLists}
						/>
					</Animated.View>
					<Animated.View style={{ width: privateWidthAnim }}>
						<ChannelList
							listData={[...state.privateChannels, ...state.currentUser.friends]}
							PMs={state.PMs}
							channelType="private"
							navigation={navigation}
							currentUser={state.currentUser}
							handleEditChannel={handleClick}
							channelSearch={channelSearch}
							publicWidthAnim={publicWidthAnim}
							privateWidthAnim={privateWidthAnim}
							// showLists={showLists}
						/>
					</Animated.View>
				</View>
			</SafeAreaView>
			{/* </NavigationContainer> */}
		</>
		// </View>
	);
};

const styles = StyleSheet.create({
	channel: {
		height: 60,
		backgroundColor: '#808080',
		margin: 5,
		borderRadius: 10,
	},
	// navigationContainer: {
	// 	paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
	// },
	privateChannel: {
		height: 60,
		backgroundColor: '#301934',
		margin: 5,
		borderRadius: 10,
	},
	title: {
		color: 'white',
	},
	channelDivider: {
		flexDirection: 'row',
		justifyContent: 'center',
	},
	container: {
		height: Dimensions.get('window').height,
		backgroundColor: '#000',
	},
	userDisplay: {
		flexDirection: 'row',
		justifyContent: 'space-around',
		borderBottomWidth: 1,
		borderBottomColor: '#d3d3d3',
		paddingBottom: 10,
	},
	userTitle: {
		fontSize: 20,
		fontWeight: 'bold',
		textAlign: 'center',
		marginLeft: 10,
		marginBottom: 3,
		alignSelf: 'center',
		color: 'white',
	},
});

export default AccountScreen;
