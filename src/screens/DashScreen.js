import React, { useState, useContext, useEffect, useRef } from 'react';
import {
	View,
	StyleSheet,
	Text,
	Dimensions,
	Image,
	TouchableOpacity,
	TouchableHighlight,
	FlatList,
	Platform,
} from 'react-native';
import { Input, Button } from 'react-native-elements';
import { SafeAreaView } from 'react-navigation';
import { Context as ChannelContext } from '../context/ChannelContext';
import SocketContext from '../context/SocketContext';
import AvatarPicker from '../components/AvatarPicker';
import { Entypo, MaterialIcons } from '@expo/vector-icons';
import UserAvatar from '../components/UserAvatar';
import UserSearchItem from '../components/UserSearchItem';
import FriendsList from '../components/FriendsList';
import UserSearchList from '../components/UserSearchList';
import PendingList from '../components/PendingList';
import BlockedList from '../components/BlockedList';
import WhiteText from '../components/WhiteText';
import { back, navigate } from '../navigationRef';
import { NavigationEvents } from 'react-navigation';

const DashScreen = ({ navigation }) => {
	const listRef = useRef();
	const { state, fetchChannels, updateState } = useContext(ChannelContext);
	const socket = useContext(SocketContext);
	const initialIndex = navigation.getParam('initialIndex');
	const [userSearch, setUserSearch] = useState('');
	const [menuIndex, setMenuIndex] = useState(0);

	const hasMountedRef = useRef(false);
	const firstRef = useRef(true);

	useEffect(() => {
		if (hasMountedRef.current && firstRef.current && initialIndex) {
			handleMenuClick(initialIndex);
			firstRef.current = false;
		} else if (firstRef.current) {
			hasMountedRef.current = true;
		}

		socket.on('update_user', ({ newData }) => {
			// console.log('received new data', newData.currentUser);
			updateState(newData);
			// update state on add and remove friends, invite/kick from room, pm/unread msgs
		});

		return () => {
			socket.emit('disconnect');
			socket.off();
		};
	}, [state]);

	useEffect(() => {
		fetchChannels();
	}, [menuIndex]);

	const handleClick = () => {
		// showForm({ show: 'edit_user' });
	};

	const cancelForm = () => {
		// showForm(false);
		navigation.navigate('channelFlow');
	};

	const handleChangeText = (e) => {
		setUserSearch(e.target);
		console.log('UserSearch being emitted', userSearch);
		socket.emit('searchuser', userSearch);
		console.log('socket emitting search');
	};

	const handleMenuClick = (index) => {
		setMenuIndex(index);
		listRef.current.scrollToIndex({ animated: true, index: index });
	};

	const dashMenus = [
		{ name: 'search', comp: <UserSearchList user={state.currentUser} /> },
		{ name: 'friends', comp: <FriendsList user={state.currentUser} /> },
		{ name: 'pending', comp: <PendingList user={state.currentUser} /> },
		{ name: 'blocked', comp: <BlockedList user={state.currentUser} /> },
	];

	function onScrollEnd(e) {
		let contentOffset = e.nativeEvent.contentOffset;
		let viewSize = e.nativeEvent.layoutMeasurement;

		// Divide the horizontal offset by the width of the view to see which page is visible
		let pageNum = Math.round(contentOffset.x / viewSize.width);
		setMenuIndex(pageNum);
	}

	return (
		<View style={styles.container}>
			{/* <NavigationEvents onWillFocus={fetchChannels} /> */}
			<View style={{ flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center' }}>
				<Button
					containerStyle={{ alignSelf: 'center' }}
					buttonStyle={{ padding: 0, margin: 10, marginTop: Platform.OS === 'ios' ? 10 : 25 }}
					icon={
						<TouchableOpacity onPress={cancelForm}>
							<Entypo name="back" color="#0af" size={50} />
						</TouchableOpacity>
					}
					type="outline"
					titleStyle={{ color: 'rgba(0,122,255,1)', fontSize: 24 }}
				/>
				<View style={{ marginTop: 10 }}>
					<UserAvatar avatar={state.currentUser.avatar} handleClick={handleClick} />
				</View>
				<TouchableOpacity style={{ marginTop: 20 }} onPress={() => navigate('EditUser')}>
					<MaterialIcons name="settings" color="#0af" size={40} />
				</TouchableOpacity>
				<View style={styles.userBox}>
					<WhiteText>{state.currentUser.username}</WhiteText>
					<WhiteText>Account created on {state.currentUser.createdAt}</WhiteText>
					<WhiteText>Messages Sent: {state.currentUser.msgsSent}</WhiteText>
				</View>
			</View>
			<View style={styles.menuContainer}>
				{dashMenus.map((menu, index) => (
					<Button
						key={index}
						title={menu.name}
						type={menuIndex === index ? 'solid' : 'outline'}
						containerStyle={styles.menu}
						onPress={() => handleMenuClick(index)}
					/>
				))}
			</View>
			<FlatList
				ref={listRef}
				onMomentumScrollEnd={onScrollEnd}
				data={dashMenus}
				horizontal
				pagingEnabled={true}
				keyExtractor={(item) => item.name}
				renderItem={({ item }) => {
					return item.comp;
				}}
			/>
		</View>
	);
};

const styles = StyleSheet.create({
	avatarStyle: {
		height: 50,
		width: 50,
		borderRadius: 25,
	},
	userBox: {
		marginTop: 40,
		alignSelf: 'center',
	},
	container: {
		backgroundColor: '#000',
		flex: 1,
	},
	menuContainer: {
		flexDirection: 'row',
	},
	menu: {
		flexGrow: 1,
	},
});

export default DashScreen;
