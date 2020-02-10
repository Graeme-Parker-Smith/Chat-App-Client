import React, { useContext, useState, useEffect, useRef } from 'react';
import { View, Image, StyleSheet, Text, FlatList, TouchableOpacity, Dimensions, AppState } from 'react-native';
import { Button, Input } from 'react-native-elements';
import { SafeAreaView, NavigationEvents } from 'react-navigation';
import { Context as AuthContext } from '../context/AuthContext';
import { Context as ChannelContext } from '../context/ChannelContext';
import { FontAwesome, Entypo } from '@expo/vector-icons';
import registerForNotifications from '../services/push_notifications';
import Spacer from '../components/Spacer';
import LoadingIndicator from '../components/LoadingIndicator';
import FormHandler from '../components/FormHandler';
import ChannelList from '../components/ChannelList';
import UserPanel from '../components/UserPanel';

const AccountScreen = ({ navigation }) => {
	const { signout } = useContext(AuthContext);
	const { state, fetchChannels, addFriend, clearState } = useContext(ChannelContext);
	const [formState, setFormState] = useState('');
	const [isLoading, setIsLoading] = useState(false);
	// const [userSearch, setUserSearch] = useState('');
	const [channelSearch, setChannelSearch] = useState('');
	const hasMountedRef = useRef(false);
	const firstRef = useRef(true);

	useEffect(() => {
		if (hasMountedRef.current && firstRef.current) {
			(async () => {
				let r = await registerForNotifications({ user: state.currentUser });
				if (r === 'no userData received') handleSignout();
			})();
			firstRef.current = false;
		} else if (firstRef.current) {
			hasMountedRef.current = true;
		}
	}, [state]);

	const handleClick = (action, item = { name: '', avatar: '' }) => {
		setFormState({ show: action, item });
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

	if (formState) {
		return <FormHandler formState={formState} setFormState={setFormState} setIsLoading={setIsLoading} />;
	}

	return (
		<>
			<SafeAreaView forceInset={{ top: 'always' }} style={styles.container}>
				<View style={styles.userDisplay}>
					<UserPanel user={state.currentUser} showPanel={handleClick} />
					<Text style={styles.userTitle}>{state.currentUser.username}</Text>
					<Entypo
						name="edit"
						color="#0af"
						size={32}
						onPress={() => handleClick('edit_user')}
						style={{ alignSelf: 'center', marginLeft: 10 }}
					/>
					<FontAwesome
						name="plus-circle"
						color="#0af"
						size={32}
						style={{ alignSelf: 'center', marginLeft: 10 }}
						onPress={() => handleClick('create_public')}
					/>
					<FontAwesome
						name="plus-circle"
						color="#301934"
						size={32}
						style={{ alignSelf: 'center', marginLeft: 10 }}
						onPress={() => handleClick('create_private')}
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
				{/* <View>
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
				</View> */}
				<View style={styles.channelDivider}>
					<ChannelList
						listData={state.channels}
						channelType="public"
						navigation={navigation}
						currentUser={state.currentUser}
						handleEditChannel={handleClick}
						channelSearch={channelSearch}
					/>
					<ChannelList
						listData={[...state.privateChannels, ...state.currentUser.friends]}
						channelType="private"
						navigation={navigation}
						currentUser={state.currentUser}
						handleEditChannel={handleClick}
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
		justifyContent: 'center',
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
