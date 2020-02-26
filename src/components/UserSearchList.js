import React, { useState, useContext, useEffect } from 'react';
import {
	View,
	StyleSheet,
	Text,
	Dimensions,
	Image,
	TouchableOpacity,
	TouchableHighlight,
	FlatList,
} from 'react-native';
import { Input, Button } from 'react-native-elements';
import { Context as ChannelContext } from '../context/ChannelContext';
import SocketContext from '../context/SocketContext';
import { Entypo, MaterialIcons } from '@expo/vector-icons';
import UserAvatar from './UserAvatar';
import UserSearchItem from './UserSearchItem';
import WhiteText from './WhiteText';

const UserSearchList = ({ user, showForm, setIsLoading }) => {
	const socket = useContext(SocketContext);
	const { addFriend, unblock, state } = useContext(ChannelContext);
	const [userSearch, setUserSearch] = useState('');
	const [searchResults, setSearchResults] = useState([]);

	useEffect(() => {
		socket.on('usersearch', ({ results }) => {
			setSearchResults(results);
		});
	}, [state, userSearch, searchResults]);

	useEffect(() => {
		if (userSearch.length > 0) {
			socket.emit('usersearch', { currentUser: state.currentUser, searchKey: userSearch });
		}
	}, [state]);

	const doSearch = () => {
		if (userSearch.length > 0) {
			socket.emit('usersearch', { currentUser: state.currentUser, searchKey: userSearch });
		}
	};

	// Warning: Can't perform a React state update on an unmounted component.
	//  This is a no-op, but it indicates a memory leak in your application. To fix, cancel
	//  all subscriptions and asynchronous tasks in %s.%s, a useEffect cleanup function,
	//   in UserSearchList (at DashScreen.js:55)

	return (
		<View style={styles.container}>
			<WhiteText>Search</WhiteText>
			<Input
				label="Search Users"
				value={userSearch}
				onChangeText={setUserSearch}
				autoCapitalize="none"
				autoCorrect={false}
				inputStyle={{ color: 'white' }}
				returnKeyType="send"
				selectTextOnFocus={true}
				onSubmitEditing={doSearch}
				rightIcon={
					<MaterialIcons name="send" size={32} color={userSearch ? '#0af' : '#808080'} onPress={doSearch} />
				}
			/>
			<FlatList
				data={searchResults}
				keyExtractor={item => item.username}
				renderItem={({ item }) => {
					// if (item.username.includes(userSearch)) {
					return <UserSearchItem currentUser={state.currentUser} friend={item} />;
					// }
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
	container: {
		backgroundColor: '#000',
		flex: 1,
		width: Dimensions.get('window').width,
	},
});

export default UserSearchList;
