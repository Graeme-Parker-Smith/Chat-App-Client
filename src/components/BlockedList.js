import React, { useState, useContext } from 'react';
import { View, StyleSheet, FlatList, Dimensions } from 'react-native';
import { Input } from 'react-native-elements';
import { Context as ChannelContext } from '../context/ChannelContext';
import UserSearchItem from './UserSearchItem';
import WhiteText from './WhiteText';
import AnimSearchBar from './AnimSearchBar';

const FriendsList = ({ user, showForm, setIsLoading }) => {
	const { addFriend, unblock, state } = useContext(ChannelContext);
	const [userSearch, setUserSearch] = useState('');

	return (
		<View style={styles.container}>
			<WhiteText>Blocked Users</WhiteText>
			{state.currentUser.blocked.length < 1 ? (
				<WhiteText>You're not blocking anyone! That's chill.</WhiteText>
			) : null}
			<AnimSearchBar
				placeholder="Search Blocked Users"
				value={userSearch}
				onChangeText={setUserSearch}
				autoCapitalize="none"
				autoCorrect={false}
				inputStyle={{ color: 'white' }}
				returnKeyType="send"
				selectTextOnFocus={true}
			/>
			<View>
				<FlatList
					style={styles.list}
					userSearch={userSearch}
					data={state.currentUser.blocked}
					keyExtractor={(item) => item.username}
					renderItem={({ item }) => {
						if (item.username.includes(userSearch)) {
							return <UserSearchItem currentUser={state.currentUser} friend={item} />;
						}
					}}
				/>
			</View>
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
	list: {
		height: Dimensions.get('window').height - 300,
		borderColor: '#808080',
		borderWidth: 1,
		margin: 10,
		marginBottom: 25,
	},
});

export default FriendsList;
