import React, { useState, useContext } from 'react';
import {
	View,
	StyleSheet,
	FlatList,
} from 'react-native';
import { Input } from 'react-native-elements';
import { Context as ChannelContext } from '../context/ChannelContext';
import UserSearchItem from './UserSearchItem';
import WhiteText from './WhiteText';

const FriendsList = ({ user, showForm, setIsLoading }) => {
	const { addFriend, unblock, state } = useContext(ChannelContext);
	const [userSearch, setUserSearch] = useState('');

	return (
		<View style={styles.container}>
			<WhiteText>Blocked Users</WhiteText>
			{state.currentUser.blocked.length < 1 ? (
				<WhiteText>You're not blocking anyone! That's chill.</WhiteText>
			) : null}
			<Input
				label="Search Friends"
				value={userSearch}
				onChangeText={setUserSearch}
				autoCapitalize="none"
				autoCorrect={false}
				inputStyle={{ color: 'white' }}
				returnKeyType="send"
				selectTextOnFocus={true}
			/>
			<FlatList
				userSearch={userSearch}
				data={state.currentUser.blocked}
				keyExtractor={item => item.username}
				renderItem={({ item }) => {
					if (item.username.includes(userSearch)) {
						return <UserSearchItem currentUser={state.currentUser} friend={item} />;
					}
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
	},
});

export default FriendsList;
