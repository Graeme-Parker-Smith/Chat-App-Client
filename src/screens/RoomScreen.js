import React, { useState, useContext, useEffect, useRef, memo, useMemo } from 'react';
import {
	View,
	StyleSheet,
	Text,
	FlatList,
	TouchableOpacity,
	ScrollView,
	KeyboardAvoidingView,
	Keyboard,
	Platform,
	Dimensions,
	Animated,
	PanResponder,
} from 'react-native';
import { Button, Input, ListItem } from 'react-native-elements';
import { NavigationEvents, withNavigationFocus, SafeAreaView } from 'react-navigation';
import { back, navigate } from '../navigationRef';
import Spacer from '../components/Spacer';
import { Context as MessageContext } from '../context/MessageContext';
import { Context as ChannelContext } from '../context/ChannelContext';
import SocketContext from '../context/SocketContext';
import uuid from 'uuid/v4';
import MessageItem from '../components/MessageItem';
import KeyboardShift from '../components/KeyBoardShift';
import * as ImagePicker from 'expo-image-picker';
import * as Permissions from 'expo-permissions';
import { MaterialIcons, Entypo } from '@expo/vector-icons';
import { Video } from 'expo-av';
import * as FileSystem from 'expo-file-system';
import imgUpload from '../helpers/imgUpload';
import base64 from 'react-native-base64';
import InviteMenu from '../components/InviteMenu';
import LoadingIndicator from '../components/LoadingIndicator';

let _layoutsMap = [];
let itemHeights = [];

const RoomScreen = ({ navigation, isFocused }) => {
	const scrollViewRef = useRef();
	const didMountRef = useRef(false);
	const socket = useContext(SocketContext);
	const {
		state: { currentUser, channels },
	} = useContext(ChannelContext);

	let roomName = navigation.getParam('roomName');
	let roomType = navigation.getParam('roomType');
	let room_id = navigation.getParam('room_id');
	let friend = navigation.getParam('friend');
	let roomCreator = navigation.getParam('roomCreator');
	// console.log('roomName', roomName);
	// console.log('roomType', roomType);
	// console.log('room_id', room_id);
	// console.log('friend', friend);
	// console.log('roomCreator', roomCreator);


	const isOwner = currentUser._id === roomCreator;

	const [loading, setLoading] = useState(false);
	const [keyboardShowing, setKeyboardShowing] = useState(false);
	const [keyboardHeight, setKeyboardHeight] = useState(0);
	const [content, setContent] = useState('');
	const [inputHeight, setInputHeight] = useState(35);
	// const [scrollPosition, setScrollPosition] = useState(0);
	// const [endScrollPosition, setEndScrollPosition] = useState(0);
	const [scrollValues, setScrollValues] = useState({
		layoutHeight: 0,
		offsetY: 0,
		contentHeight: 0,
	});
	const [users, setUsers] = useState([]);
	const {
		state,
		fetchMessages,
		addMessage,
		addQuickMessage,
		fetchEarlierMessages,
		clearMessages,
		sendNotification,
	} = useContext(MessageContext);
	// const pan = useRef(new Animated.ValueXY()).current;

	// const panResponder = useRef(
	// 	PanResponder.create({
	// 		onMoveShouldSetPanResponder: () => true,
	// 		onPanResponderGrant: () => {
	// 			pan.setOffset({
	// 				x: pan.x._value,
	// 				y: pan.y._value,
	// 			});
	// 		},
	// 		onPanResponderMove: Animated.event([null, { dx: pan.x, dy: pan.y }]),
	// 		onPanResponderRelease: () => {
	// 			pan.flattenOffset();
	// 		},
	// 	})
	// ).current;

	const _keyboardDidShow = (e) => {
		setKeyboardShowing(true);
		setKeyboardHeight(e.endCoordinates.height);
	};

	const _keyboardDidHide = () => {
		setKeyboardShowing(false);
		setKeyboardHeight(0);
	};

	// ============================================================
	//                HANDLE COMPONENT DID MOUNT AND UNMOUNT
	// ============================================================

	useEffect(() => {
		socket.emit('join', { name: currentUser.username, userId: currentUser._id, room: room_id }, (error) => {
			if (error) {
				// if (error === 'Username is taken') {
				// 	navigation.replace('Account');
				// 	alert('Error: Username is Taken.');
				// }
			}
		});
		keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', _keyboardDidShow);
		keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', _keyboardDidHide);

		return () => {
			console.log('component unmounting');
			keyboardDidShowListener.remove();
			keyboardDidHideListener.remove();
			socket.emit('leave', { room: roomName, name: currentUser.username });
		};
	}, []);

	const handleGoBack = () => {
		back('Account');
		console.log('component unmounting');
		keyboardDidShowListener.remove();
		keyboardDidHideListener.remove();
		socket.emit('leave', { room: roomName, name: currentUser.username });
	};

	// ============================================================
	//              HANDLE COMPONENT RECEIVE DATA FROM SERVER
	// ============================================================

	useEffect(() => {
		socket.on('message', ({ user, avatar, text, time, isImage, isVideo }) => {
			const newMessage = {
				creator: user,
				avatar,
				content: text,
				time,
				isImage,
				isVideo,
				roomName,
			};
			addQuickMessage(newMessage);
			handleAutoScroll();
		});

		socket.on('roomData', ({ users }) => {
			console.log('got room data');
			const userNames = users.map((u) => u.name);
			setUsers(userNames);
		});
		socket.on('kick', ({ roomName, removee }) => {
			console.log('removee is: ', removee);
			console.log('roomName is: ', roomName);
			console.log('username is: ', currentUser.username);
			if (currentUser.username === removee) {
				console.log('user must go back!');
				navigation.navigate('Account');
			}
		});

		return () => {
			socket.emit('disconnect');
			socket.off();
		};
	}, [state, users]);

	// ============================================================
	//   HANDLE COMPONENT LOSE FOCUS/NAVIGATE AWAY FROM SCREEN
	// ============================================================

	useEffect(() => {
		if (didMountRef.current) {
			if (!isFocused) {
				socket.emit('leave', { room: roomName, name: currentUser.username });
			}
		} else {
			didMountRef.current = true;
		}
	}, [isFocused]);

	// ============================================================
	//                SEND TEXT MESSAGE FUNCTION
	// ============================================================

	const sendNewMessage = () => {
		if (!content) return;
		const date = new Date();
		const time = date.toLocaleString();
		const messageToSend = {
			creator: currentUser.username,
			avatar: currentUser.avatar,
			content,
			roomName,
			time,
			isImage: false,
			isVideo: false,
			roomType,
			room_id: room_id,
		};
		socket.emit('sendMessage', messageToSend);
		if (roomType === 'pm') {
			const friend_id = friend._id;
			sendNotification({ sender: currentUser._id, messageBody: content, receiver: friend_id, room_id: room_id });
		}
		setContent('');
	};

	// ============================================================
	//                IMAGE AND VIDEO FUNCTIONS
	// ============================================================
	const getPermissionAsync = async () => {
		if (Platform.OS === 'ios') {
			console.log('starting async permissions');
			const { status } = await Permissions.askAsync(Permissions.CAMERA_ROLL);
			if (status !== 'granted') {
				alert('Sorry, we need camera roll permissions to make this work!');
			}
		}
	};

	const _pickImage = async () => {
		let result = await ImagePicker.launchImageLibraryAsync({
			mediaTypes: ImagePicker.MediaTypeOptions.All,
			allowsEditing: false,
			aspect: [4, 3],
			quality: undefined,
			base64: true,
		});

		// console.log(result);

		if (!result.cancelled) {
			const date = new Date();
			const time = date.toLocaleString();
			let imageToSend;
			if (result.type === 'video') {
				const cloudUrl = await imgUpload(`data:image/jpg;base64,${result.base64}`, true);
				imageToSend = {
					creator: currentUser.username,
					content: cloudUrl,
					avatar: currentUser.avatar,
					roomName,
					time,
					isImage: false,
					isVideo: true,
					roomType,
					room_id,
				};
			} else {
				const cloudUrl = await imgUpload(`data:image/jpg;base64,${result.base64}`);
				imageToSend = {
					creator: currentUser.username,
					content: cloudUrl,
					avatar: currentUser.avatar,
					roomName,
					time,
					isImage: true,
					isVideo: false,
					roomType,
					room_id,
				};
			}
			socket.emit('sendMessage', imageToSend);
		}
	};
	const launchCamera = async () => {
		await Permissions.askAsync(Permissions.CAMERA_ROLL);
		await Permissions.askAsync(Permissions.CAMERA);
		let result = await ImagePicker.launchCameraAsync({
			mediaTypes: ImagePicker.MediaTypeOptions.All,
			allowsEditing: false,
			aspect: [4, 3],
			quality: undefined,
			base64: true,
		});

		if (!result.cancelled) {
			const date = new Date();
			const time = date.toLocaleString();
			let imageToSend;
			if (result.type === 'video') {
				const cloudUrl = await imgUpload(result.uri, true);
				imageToSend = {
					creator: currentUser.username,
					content: cloudUrl,
					avatar: currentUser.avatar,
					roomName,
					time,
					isImage: false,
					isVideo: true,
					roomType,
					room_id,
				};
			} else {
				const cloudUrl = await imgUpload(`data:image/jpg;base64,${result.base64}`);
				imageToSend = {
					creator: currentUser.username,
					content: cloudUrl,
					avatar: currentUser.avatar,
					roomName,
					time,
					isImage: true,
					isVideo: false,
					roomType,
					room_id,
				};
			}
			socket.emit('sendMessage', imageToSend);
		}
	};

	// ============================================================
	//                SCROLL FUNCTIONS
	// ============================================================
	const scrollToBottom = () => {
		// const offset = itemHeights.reduce((a, b) => a + b, 0);
		const offset = _layoutsMap.reduce((a, b) => a + b, 0);
		if (scrollViewRef.current.scrollToEnd && offset > 470) {
			try {
				// const offset = getOffsetByIndex(state.length - 1);
				scrollViewRef.current.scrollToOffset({ offset, animated: false });
			} catch {
				console.log('scroll bs');
			}
		} else {
			return;
		}
	};
	const handleScroll = async (e) => {
		setScrollValues({
			layoutHeight: e.nativeEvent.layoutMeasurement.height,
			offsetY: e.nativeEvent.contentOffset.y,
			contentHeight: e.nativeEvent.contentSize.height,
		});
		// setScrollPosition(e.nativeEvent.contentOffset.y);
		// console.log("scroll event CONTENT OFFSET.y: ", e.nativeEvent);

		// e.nativeEvent.contentOffset.y < 1 tells us if user has scrolled to top
		if (e.nativeEvent.contentOffset.y < 1 && loading === false && state.length > 18) {
			setLoading(true);
			await fetchEarlierMessages(state, roomName, roomType, room_id);
			// May need to change this to scrollToOffset
			scrollViewRef.current.scrollToIndex({
				index: 11,
				viewOffset: 100,
				viewPosition: 0,
				animated: false,
			});
			setTimeout(() => {
				setLoading(false);
			}, 100);
		}
	};
	const handleAutoScroll = (width, height) => {
		if (isCloseToBottom(scrollValues) && state.length > 10) {
			try {
				// const offset = itemHeights.reduce((a, b) => a + b, 0);
				const offset = _layoutsMap.reduce((a, b) => a + b, 0);

				scrollViewRef.current.scrollToOffset({ offset, animated: false });
			} catch {
				console.log('scroll bs');
			}
		}
	};

	const isCloseToBottom = ({ layoutHeight, offsetY, contentHeight }) => {
		const paddingToBottom = 20;
		return layoutHeight + offsetY >= contentHeight - paddingToBottom;
	};

	// ============================================================
	//                PREPARE FLATLIST PROPS
	// ============================================================

	const addToLayoutsMap = (layout, index) => {
		_layoutsMap[index] = layout;
	};

	const renderItemOutside = (item, index) => {
		return (
			// <Animated.View
			// 	style={{ transform: [{ translateX: pan.x }, { translateY: pan.y }] }}
			// 	{...panResponder.panHandlers}
			// >
			<MessageItem
				currentUserUsername={currentUser.username}
				itemId={item._id}
				content={item.content}
				username={item.creator}
				time={item.time}
				avatar={item.avatar}
				isImage={item.isImage ? true : false}
				isVideo={item.isVideo ? true : false}
				index={index}
				channelId={item.channel}
				addToLayoutsMap={addToLayoutsMap}
			/>
			// </Animated.View>
		);
	};

	const keyExtractor = (item) => (item._id ? item._id : uuid());

	// ============================================================
	//                CREATE LIST OF USERS IN ROOM
	// ============================================================
	let userList = users.reduce((total, value, idx) => {
		if (idx === 0) return total + value;
		return total + ', ' + value;
	}, []);

	// ============================================================
	//                DO THIS ON SCREEN FOCUS
	// ============================================================
	const handleOnFocus = async () => {
		console.log('focusing roomscreen...');
		if (room_id === undefined && channels.length > 0) {
			let randomRoom = channels[Math.floor(Math.random() * channels.length)];
			console.log('randomRoom', randomRoom);
			room_id = randomRoom._id;
			roomName = randomRoom.name;
			roomType = 'public';
			roomCreator = randomRoom.creator;
			
		}
		socket.emit('join', { name: currentUser.username, userId: currentUser._id, room: room_id }, (error) => {
			if (error) {
				// if (error === 'Username is taken') {
				// 	navigation.replace('Account');
				// 	alert('Error: Username is Taken.');
				// }
			}
		});
		socket.on('roomData', ({ users }) => {
			console.log('got room data');
			const userNames = users.map((u) => u.name);
			setUsers(userNames);
		});
		keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', _keyboardDidShow);
		keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', _keyboardDidHide);
		await clearMessages();
		await fetchMessages(roomName, roomType, room_id);
		scrollToBottom();
	};

	const handleOnBlur = async () => {
		console.log('component blurring...');
		keyboardDidShowListener.remove();
		keyboardDidHideListener.remove();
		socket.emit('leave', { room: roomName, name: currentUser.username });
	};

	if (!currentUser) {
		return (
			<View>
				<LoadingIndicator />
			</View>
		);
	}

	return (
		<SafeAreaView style={styles.body}>
			<NavigationEvents onWillFocus={handleOnFocus} onWillBlur={handleOnBlur} />
			<View style={{ marginTop: 0, backgroundColor: '#000' }}>
				<View style={{ flexDirection: 'row', alignItems: 'center' }}>
					<Button
						containerStyle={{ alignSelf: 'center' }}
						buttonStyle={{ padding: 0, margin: 10, marginTop: Platform.OS === 'ios' ? 10 : 25 }}
						icon={
							<TouchableOpacity onPress={() => navigate('Account')}>
								<Entypo name="back" color="#0af" size={50} />
							</TouchableOpacity>
						}
						type="outline"
						titleStyle={{ color: 'rgba(0,122,255,1)', fontSize: 24 }}
					/>
					{roomType === 'private' && isOwner ? <InviteMenu roomName={roomName} /> : null}
					<Text style={{ marginLeft: 0, fontSize: 12, color: '#fff', alignSelf: 'center' }}>
						@{roomName} ({users.length} users online): {userList}
					</Text>
				</View>
				{!isCloseToBottom(scrollValues) ? (
					<Button
						containerStyle={{
							height: 30,
							position: 'absolute',
							top: Platform.OS === 'ios' ? 70 : 90,
							zIndex: 1000,
							width: Dimensions.get('window').width,
						}}
						buttonStyle={{ height: 30, backgroundColor: '#0af', opacity: 0.5 }}
						title="Jump to Bottom"
						titleStyle={{ color: 'black', fontSize: 12, textAlign: 'center' }}
						onPress={scrollToBottom}
					/>
				) : (
					<View style={{ backgroundColor: 'black', height: 0 }} />
				)}
				<View>
					<FlatList
						style={{
							backgroundColor: 'black',
							height:
								Platform.OS === 'ios'
									? Dimensions.get('window').height * 0.83 - keyboardHeight - inputHeight
									: Dimensions.get('window').height * 0.86 - keyboardHeight - inputHeight,
							flexGrow: 0,
						}}
						bounces={true}
						indicatorStyle="white"
						keyboardDismissMode="interactive"
						keyboardShouldPersistTaps={'always'}
						ref={scrollViewRef}
						onContentSizeChange={handleAutoScroll}
						onScroll={handleScroll}
						scrollEventThrottle={16}
						overScrollMode="auto"
						data={state}
						keyExtractor={keyExtractor}
						renderItem={({ item, index }) => renderItemOutside(item, index)}
						getItemLayout={(data, index) => {
							let height = 46;
							if (data[index].isImage || data[index].isVideo) {
								height = 224.33325;
							} else if (data[index].content.length > 32) {
								height = 67.33337;
							}
							itemHeights[index] = height;
							return {
								length: height,
								offset: height * index,
								index,
							};
						}}
						removeClippedSubviews={true}
					/>
				</View>
				<Input
					autoFocus
					multiline={true}
					maxLength={750}
					value={content}
					onChangeText={setContent}
					blurOnSubmit={false}
					// onSubmitEditing={sendNewMessage}
					placeholder="Type Your message here"
					inputStyle={{
						color: '#fff',
						borderWidth: 1,
						borderColor: '#0af',
						borderRadius: 15,
						padding: 5,
						alignSelf: 'flex-start',
						height: Math.max(35, inputHeight),
					}}
					placeholderTextColor="#fff"
					onContentSizeChange={(event) =>
						Platform.OS === 'ios'
							? setInputHeight(event.nativeEvent.contentSize.height + 12)
							: setInputHeight(event.nativeEvent.contentSize.height)
					}
					leftIcon={
						<View
							style={{
								width: 75,
								flexDirection: 'row',
								justifyContent: 'space-around',
								marginLeft: 0,
							}}
						>
							<MaterialIcons name="photo-camera" size={32} color="#0af" onPress={launchCamera} />
							<MaterialIcons name="photo-library" size={32} color="#0af" onPress={_pickImage} />
						</View>
					}
					rightIcon={
						<MaterialIcons
							name="send"
							size={32}
							color={content ? '#0af' : '#808080'}
							onPress={sendNewMessage}
						/>
					}
				/>
			</View>
		</SafeAreaView>
	);
};

const styles = StyleSheet.create({
	body: {
		backgroundColor: '#000',
		height: Dimensions.get('window').height,
	},
});

export default memo(withNavigationFocus(RoomScreen));
