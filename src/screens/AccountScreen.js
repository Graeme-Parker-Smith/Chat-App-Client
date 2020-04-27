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

const AccountScreen = ({ navigation }) => {
	const { signout } = useContext(AuthContext);
	const { state, fetchChannels, updateState, addFriend, clearState } = useContext(ChannelContext);
	// console.log('PMS', state.PMs);
	const [formState, setFormState] = useState('');
	const [isLoading, setIsLoading] = useState(false);
	const [channelSearch, setChannelSearch] = useState('');
	const [activeLists, setActiveLists] = useState({ public: true, private: true });
	const [publicWidthAnim] = useState(new Animated.Value(Dimensions.get('window').width * 0.5));
	const [privateWidthAnim] = useState(new Animated.Value(Dimensions.get('window').width * 0.5));

	const [keyboardHeight, setKeyboardHeight] = useState(0);

	// const [publicActive, setPublicActive] = useState(true);
	// const [privateActive, setPrivateActive] = useState(true);

	const socket = useContext(SocketContext);

	const hasMountedRef = useRef(false);
	const firstRef = useRef(true);

	useEffect(() => {
		fetchChannels();
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
			console.log('received channelsData!', channelsData);
		});

		return () => {
			socket.emit('disconnect');
			socket.off();
		};
	}, [state]);

	useEffect(() => {
		if (hasMountedRef.current && firstRef.current) {
			(async () => {
				let r = await registerForNotifications({ user: state.currentUser });
				if (r === 'no userData received') handleSignout();
				_notificationSubscription = Notifications.addListener(_handleNotification);
			})();
			firstRef.current = false;
		} else if (firstRef.current) {
			hasMountedRef.current = true;
		}
	}, [state]);

	const _handleNotification = (notification) => {
		// do whatever you want to do with the notification
		console.log('Notification Incoming! ', notification);
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
		console.log('tryFetchChannels');
		const { error } = await fetchChannels();
		if (error === 'user could not be found') {
			signout();
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
				Animated.timing(publicWidthAnim, {
					toValue: 0,
					duration: 400,
				}).start();
				Animated.timing(privateWidthAnim, {
					toValue: Dimensions.get('window').width * 0.9,
					duration: 400,
				}).start();
			} else {
				setActiveLists({ ...activeLists, public: true });
				Animated.timing(publicWidthAnim, {
					toValue: Dimensions.get('window').width * (privateWidthAnim._value > 0 ? 0.5 : 0.9),
					duration: 400,
				}).start();
				Animated.timing(privateWidthAnim, {
					toValue: Dimensions.get('window').width * (privateWidthAnim._value > 0 ? 0.5 : 0),
					duration: 400,
				}).start();
			}
		} else if (listType === 'private') {
			if (privateWidthAnim._value > 0) {
				setActiveLists({ public: true, private: false });
				Animated.timing(privateWidthAnim, {
					toValue: 0,
					duration: 400,
				}).start();
				Animated.timing(publicWidthAnim, {
					toValue: Dimensions.get('window').width * 0.9,
					duration: 400,
				}).start();
			} else {
				setActiveLists({ ...activeLists, private: true });
				Animated.timing(privateWidthAnim, {
					toValue: Dimensions.get('window').width * (publicWidthAnim._value > 0 ? 0.5 : 0.9),
					duration: 400,
				}).start();
				Animated.timing(publicWidthAnim, {
					toValue: Dimensions.get('window').width * (publicWidthAnim._value > 0 ? 0.5 : 0),
					duration: 400,
				}).start();
			}
		}
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
		<>
			<NavigationEvents onWillFocus={tryFetchChannels} />
			<SafeAreaView forceInset={{ top: 'always' }} style={styles.container}>
				<View style={styles.userDisplay}>
					<View style={{ flexDirection: 'row' }}>
						<View style={{ width: Dimensions.get('window').width * 0.4 }}>
							<Text style={styles.userTitle}>{state.currentUser.username}</Text>
							{/* <Entypo
								name="edit"
								color="#0af"
								size={32}
								onPress={() => handleClick('edit_user')}
								style={{ alignSelf: 'center', marginLeft: 10 }}
							/> */}
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
								{/* <Button title="Sign Out" type="outline" containerStyle={{ margin: 10 }} /> */}
							</TouchableOpacity>
						</View>
					</View>
					<View style={{ alignSelf: 'center' }}>
						<UserPanel user={state.currentUser} handleClick={handleClick} />
					</View>
					<MaterialCommunityIcons
						name="comment-plus"
						color="#808080"
						size={48}
						style={{ alignSelf: 'center', marginLeft: 10 }}
						onPress={() => handleClick('create_public')}
					/>
					<MaterialCommunityIcons
						name="comment-plus"
						color="#301934"
						size={48}
						style={{ alignSelf: 'center', marginLeft: 10 }}
						onPress={() => handleClick('create_private')}
					/>
				</View>
				<Spacer>
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
				</Spacer>
				<Spacer>
					<View style={{ flexDirection: 'row', justifyContent: 'space-around' }}>
						<Button
							title="Public"
							// type={publicWidthAnim._value > 0 ? 'solid' : 'outline'}
							type={activeLists.public ? 'solid' : 'outline'}
							onPress={() => handleListButton('public')}
						/>
						<Button
							title="Private"
							// type={privateWidthAnim._value > 0 ? 'solid' : 'outline'}
							type={activeLists.private ? 'solid' : 'outline'}
							onPress={() => handleListButton('private')}
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
				{/* <Spacer>
					<Button title="Sign Out" onPress={handleSignout} />
				</Spacer> */}
			</SafeAreaView>
		</>
	);
};

const styles = StyleSheet.create({
	channel: {
		height: 60,
		backgroundColor: '#808080',
		margin: 5,
		borderRadius: 10,
	},
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
