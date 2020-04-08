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
} from 'react-native';
import { Button, Input } from 'react-native-elements';
import { SafeAreaView, NavigationEvents } from 'react-navigation';
import { Context as AuthContext } from '../context/AuthContext';
import { Context as ChannelContext } from '../context/ChannelContext';
import { FontAwesome, Entypo, MaterialCommunityIcons } from '@expo/vector-icons';
import registerForNotifications from '../services/push_notifications';
import Spacer from '../components/Spacer';
import LoadingIndicator from '../components/LoadingIndicator';
import FormHandler from '../components/FormHandler';
import ChannelList from '../components/ChannelList';
import UserPanel from '../components/UserPanel';
import AnimSearchBar from '../components/AnimSearchBar';

const AccountScreen = ({ navigation }) => {
	const { signout } = useContext(AuthContext);
	const { state, fetchChannels, addFriend, clearState } = useContext(ChannelContext);
	const [formState, setFormState] = useState('');
	const [isLoading, setIsLoading] = useState(false);
	const [channelSearch, setChannelSearch] = useState('');
	// const [showLists, setShowLists] = useState({ public: true, private: true, publicWidth: 0.5, privateWidth: 0.5 });
	const [publicWidthAnim] = useState(new Animated.Value(Dimensions.get('window').width * 0.5));
	const [privateWidthAnim] = useState(new Animated.Value(Dimensions.get('window').width * 0.5));

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
		console.log('tryFetchChannels');
		const { error } = await fetchChannels();
		if (error === 'user could not be found') {
			signout();
		}
	};

	const handleSignout = () => {
		signout();
		clearState();
	};

	const handleListButton = listType => {
		console.log(publicWidthAnim);
		console.log('privateWidthAnim', privateWidthAnim);
		if (listType === 'public') {
			if (publicWidthAnim && privateWidthAnim) {
				console.log('typeof', typeof publicWidthAnim);
				Animated.timing(publicWidthAnim, {
					toValue: 0,
					duration: 2000,
				}).start();
				Animated.timing(privateWidthAnim, {
					toValue: Dimensions.get('window').width * 0.9,
					duration: 2000,
				}).start();
				console.log(publicWidthAnim);
				console.log('privateWidthAnim', privateWidthAnim);
			}
		} else if (listType === 'private') {
			if (publicWidthAnim && privateWidthAnim) {
				Animated.timing(privateWidthAnim, {
					toValue: 0,
					duration: 2000,
				}).start();
				Animated.timing(publicWidthAnim, {
					toValue: Dimensions.get('window').width * 0.9,
					duration: 2000,
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
					<UserPanel user={state.currentUser} handleClick={handleClick} />
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
				<View style={{ flexDirection: 'row', justifyContent: 'space-around' }}>
					<Button
						title="Public"
						type={publicWidthAnim ? 'solid' : 'outline'}
						onPress={() => handleListButton('public')}
					/>
					<Button
						title="Private"
						type={privateWidthAnim ? 'solid' : 'outline'}
						onPress={() => handleListButton('private')}
					/>
					{/* <MaterialCommunityIcons
						name={showLists.public ? 'arrow-collapse-horizontal' : 'arrow-expand-horizontal'}
						size={32}
						color="#0af"
						style={{ marginBottom: 0 }}
						onPress={() => setShowLists({ ...showLists, public: !showLists.public })}
					/>
					<MaterialCommunityIcons
						name={showLists.private ? 'arrow-collapse-horizontal' : 'arrow-expand-horizontal'}
						size={32}
						color="#0af"
						style={{ marginBottom: 0 }}
						onPress={() => setShowLists({ ...showLists, private: !showLists.private })}
					/> */}
				</View>
				<View style={styles.channelDivider}>
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
