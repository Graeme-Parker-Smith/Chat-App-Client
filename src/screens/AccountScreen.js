import React, { useContext, useState, useEffect, useRef } from 'react';
import { View, Image, StyleSheet, Text, FlatList, TouchableOpacity, Dimensions, AppState } from 'react-native';
import { Button, Input } from 'react-native-elements';
import { SafeAreaView } from 'react-navigation';
import { NavigationEvents } from 'react-navigation';
import Spacer from '../components/Spacer';
import LoadingIndicator from '../components/LoadingIndicator';
import CreateChannelForm from '../components/CreateChannelForm';
import CreatePrivateChannelForm from '../components/CreatePrivateChannelForm';
import EditUserForm from '../components/EditUserForm';
import EditChannelForm from '../components/EditChannelForm';
import EditPrivateChannelForm from '../components/EditPrivateChannelForm';
import { ListItem } from 'react-native-elements';
import { Context as AuthContext } from '../context/AuthContext';
import { Context as ChannelContext } from '../context/ChannelContext';
import { FontAwesome, Entypo } from '@expo/vector-icons';
import registerForNotifications from '../services/push_notifications';
import ChannelList from '../components/ChannelList';
import chatApi from '../api/requester';
import b64 from 'base64-arraybuffer';

const AccountScreen = ({ navigation }) => {
	const { signout } = useContext(AuthContext);
	const { state, fetchChannels, addFriend, clearState } = useContext(ChannelContext);
	const [showEditUserForm, setShowEditUserForm] = useState(false);
	const [showCreateChannelForm, setShowCreateChannelForm] = useState(false);
	const [showCreatePrivateChannelForm, setShowCreatePrivateChannelForm] = useState(false);
	const [showEditChannelForm, setShowEditChannelForm] = useState({
		showForm: false,
		roomName: '',
		avatar: '',
	});
	const [showEditPrivateChannelForm, setShowEditPrivateChannelForm] = useState({
		showForm: false,
		roomName: '',
		avatar: '',
	});
	const [isLoading, setIsLoading] = useState(false);
	const [userSearch, setUserSearch] = useState('');
	const [channelSearch, setChannelSearch] = useState('');
	const hasMountedRef = useRef(false);
	const firstRef = useRef(true);
	const [mergeP, setMergeP] = useState({});

	useEffect(() => {
		console.log('hasMountedRef.current', hasMountedRef.current);
		if (hasMountedRef.current && firstRef.current) {
			console.log('component has mounted. Get push token.');
			(async () => {
				setMergeP([...state.privateChannels, ...state.currentUser.friends]);
				let r = await registerForNotifications({ user: state.currentUser });
				if (r === 'no userData received') handleSignout();
				// const response = await chatApi.get('/images', { params: { avatarId: state.currentUser.avatar } });
				// // base64 conversion takes 0.59 seconds
				// console.log(response);
				// const base64Flag = 'data:image/jpeg;base64,';
				// const imageStr = b64.encode(response.data);
				// setUserAvatar(base64Flag + imageStr);
				// console.log(b64.encode(response.data.Imgs[0].img.data.data));
			})();
			firstRef.current = false;
		} else if (firstRef.current) {
			hasMountedRef.current = true;
		}
	}, [state]);

	const handleEditUserClick = () => {
		setShowEditUserForm(true);
		setShowCreateChannelForm(false);
		setShowCreatePrivateChannelForm(false);
		setShowEditChannelForm({
			showForm: false,
			roomName: '',
			avatar: '',
		});
	};
	const handleCreateChannelClick = () => {
		setShowCreateChannelForm(true);
		setShowCreatePrivateChannelForm(false);
		setShowEditUserForm(false);
		setShowEditChannelForm({
			showForm: false,
			roomName: '',
			avatar: '',
		});
	};
	const handleCreatePrivateChannelClick = () => {
		setShowCreatePrivateChannelForm(true);
		setShowCreateChannelForm(false);
		setShowEditUserForm(false);
		setShowEditChannelForm({
			showForm: false,
			roomName: '',
			avatar: '',
		});
	};
	const handleEditChannelClick = item => {
		setShowEditChannelForm({
			showForm: true,
			roomName: item.name,
			avatar: item.avatar,
		});
		setShowEditUserForm(false);
		setShowCreateChannelForm(false);
		setShowCreatePrivateChannelForm(false);
	};
	const handleEditPrivateChannelClick = item => {
		setShowEditPrivateChannelForm({
			showForm: true,
			roomName: item.name,
			avatar: item.avatar,
		});
		setShowEditUserForm(false);
		setShowCreateChannelForm(false);
		setShowCreatePrivateChannelForm(false);
	};

	const tryFetchChannels = async () => {
		const { error } = await fetchChannels();
		if (error === 'user could not be found') {
			signout();
		}
	};

	const handleSignout = () => {
		signout();
		clearState();
	};

	if (!state.currentUser || isLoading) {
		return (
			<View>
				<NavigationEvents onWillFocus={tryFetchChannels} />
				<LoadingIndicator />
			</View>
		);
	}

	return (
		<>
			<SafeAreaView forceInset={{ top: 'always' }} style={styles.container}>
				<View style={styles.userDisplay}>
					<View>
						{state.currentUser.avatar ? (
							<Image source={{ uri: state.currentUser.avatar }} style={styles.avatarStyle} />
						) : (
							<Entypo name="user" size={50} color="#0af" />
						)}
					</View>
					<Text style={styles.userTitle}>{state.currentUser.username}</Text>
					<Entypo
						name="edit"
						color="#0af"
						size={32}
						onPress={handleEditUserClick}
						style={{ alignSelf: 'center', marginLeft: 10 }}
					/>
					<FontAwesome
						name="plus-circle"
						color="#0af"
						size={32}
						style={{ alignSelf: 'center', marginLeft: 10 }}
						onPress={handleCreateChannelClick}
					/>
					<FontAwesome
						name="plus-circle"
						color="#301934"
						size={32}
						style={{ alignSelf: 'center', marginLeft: 10 }}
						onPress={handleCreatePrivateChannelClick}
					/>
				</View>
				<View>
					<Input
						label="Channel Search"
						value={channelSearch}
						onChangeText={setChannelSearch}
						autoFocus={false}
						autoCapitalize="none"
						autoCorrect={false}
						inputStyle={{ color: 'white' }}
					/>
				</View>
				<View>
					{showEditUserForm ? (
						<EditUserForm showForm={setShowEditUserForm} setIsLoading={setIsLoading} />
					) : null}
					{showCreateChannelForm ? <CreateChannelForm showForm={setShowCreateChannelForm} /> : null}
					{showCreatePrivateChannelForm ? (
						<CreatePrivateChannelForm showForm={setShowCreatePrivateChannelForm} />
					) : null}
					{showEditChannelForm.showForm ? (
						<EditChannelForm
							showForm={setShowEditChannelForm}
							setIsLoading={setIsLoading}
							thisName={showEditChannelForm.roomName}
							thisAvatar={showEditChannelForm.avatar}
						/>
					) : null}
					{showEditPrivateChannelForm.showForm ? (
						<EditPrivateChannelForm
							showForm={setShowEditPrivateChannelForm}
							setIsLoading={setIsLoading}
							thisName={showEditPrivateChannelForm.roomName}
							thisAvatar={showEditPrivateChannelForm.avatar}
						/>
					) : null}
				</View>
				
				<View>
					<Input
						label="Search Users"
						value={userSearch}
						onChangeText={setUserSearch}
						autoCapitalize="none"
						autoCorrect={false}
						inputStyle={{ color: 'white' }}
						returnKeyType="send"
						selectTextOnFocus={true}
					/>
					<Button
						title="Add Friend"
						onPress={() =>
							addFriend({
								username: state.currentUser.username,
								friendName: userSearch,
							})
						}
					/>
				</View>
				<View style={styles.channelDivider}>
					<ChannelList
						listData={state.channels}
						channelType="public"
						navigation={navigation}
						currentUser={state.currentUser}
						handleEditChannel={handleEditChannelClick}
						channelSearch={channelSearch}
					/>
					<ChannelList
						listData={[...state.privateChannels, ...state.currentUser.friends]}
						channelType="private"
						navigation={navigation}
						currentUser={state.currentUser}
						handleEditChannel={handleEditPrivateChannelClick}
						channelSearch={channelSearch}
					/>
				</View>
				<Spacer>
					<Button title="Sign Out" onPress={handleSignout} />
				</Spacer>
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
		justifyContent: 'center'
	},
	avatarStyle: {
		height: 50,
		width: 50,
		borderRadius: 25,
	},
	container: {
		height: Dimensions.get('window').height,
		backgroundColor: '#000',
	},
	userDisplay: {
		flexDirection: 'row',
		justifyContent: 'flex-start',
		borderBottomWidth: 1,
		borderBottomColor: '#d3d3d3',
		paddingBottom: 10,
	},
	userTitle: {
		fontSize: 32,
		textAlign: 'center',
		marginLeft: 10,
		marginBottom: 3,
		alignSelf: 'center',
		color: 'white',
	},
});

export default AccountScreen;
