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
import WhiteText from '../components/WhiteText';

const AccountScreen = ({ navigation }) => {
	const { signout } = useContext(AuthContext);
	const { state, fetchChannels, addFriend, clearState } = useContext(ChannelContext);
	const [formState, setFormState] = useState('');
	const [isLoading, setIsLoading] = useState(false);
	const [channelSearch, setChannelSearch] = useState('');
	const [activeLists, setActiveLists] = useState({ public: true, private: true });
	const [publicWidthAnim] = useState(new Animated.Value(Dimensions.get('window').width * 0.5));
	const [privateWidthAnim] = useState(new Animated.Value(Dimensions.get('window').width * 0.5));
	// const [publicActive, setPublicActive] = useState(true);
	// const [privateActive, setPrivateActive] = useState(true);
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

	// handle list animations

	const handleListButton = (listType) => {
		if (listType === 'public') {
			if (publicWidthAnim._value > 0) {
				setActiveLists({ public: false, private: true });
				Animated.timing(publicWidthAnim, {
					toValue: 0,
					duration: 200,
				}).start();
				Animated.timing(privateWidthAnim, {
					toValue: Dimensions.get('window').width * 0.9,
					duration: 200,
				}).start();
			} else {
				setActiveLists({ ...activeLists, public: true });
				Animated.timing(publicWidthAnim, {
					toValue: Dimensions.get('window').width * (privateWidthAnim._value > 0 ? 0.5 : 0.9),
					duration: 200,
				}).start();
				Animated.timing(privateWidthAnim, {
					toValue: Dimensions.get('window').width * (privateWidthAnim._value > 0 ? 0.5 : 0),
					duration: 200,
				}).start();
			}
		} else if (listType === 'private') {
			if (privateWidthAnim._value > 0) {
				setActiveLists({ public: true, private: false });
				Animated.timing(privateWidthAnim, {
					toValue: 0,
					duration: 200,
				}).start();
				Animated.timing(publicWidthAnim, {
					toValue: Dimensions.get('window').width * 0.9,
					duration: 200,
				}).start();
			} else {
				setActiveLists({ ...activeLists, private: true });
				Animated.timing(privateWidthAnim, {
					toValue: Dimensions.get('window').width * (publicWidthAnim._value > 0 ? 0.5 : 0.9),
					duration: 200,
				}).start();
				Animated.timing(publicWidthAnim, {
					toValue: Dimensions.get('window').width * (publicWidthAnim._value > 0 ? 0.5 : 0),
					duration: 200,
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
		fontSize: 16,
		textAlign: 'center',
		marginLeft: 10,
		marginBottom: 3,
		alignSelf: 'center',
		color: 'white',
	},
});

export default AccountScreen;
