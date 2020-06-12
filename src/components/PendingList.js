import React, { useState, useContext } from 'react';
import {
	View,
	StyleSheet,
  FlatList,
  Dimensions
} from 'react-native';
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
			<WhiteText>Pending Friend Requests</WhiteText>
			{state.currentUser.requestsReceived.length < 1 ? (
				<WhiteText>You have no pending friend requests. Bummer.</WhiteText>
			) : null}
			<AnimSearchBar
				placeholder="Search Pending Requests"
				value={userSearch}
				onChangeText={setUserSearch}
				autoCapitalize="none"
				autoCorrect={false}
				inputStyle={{ color: 'white' }}
				returnKeyType="send"
				selectTextOnFocus={true}
			/>
			{/* <WhiteText>Requests Received</WhiteText> */}
			<FlatList
				userSearch={userSearch}
				data={[...state.currentUser.requestsReceived, ...state.currentUser.pending]}
				keyExtractor={item => item.username}
				renderItem={({ item }) => {
					if (item.username.includes(userSearch)) {
						return <UserSearchItem currentUser={state.currentUser} friend={item} />;
					}
				}}
			/>
			{/* <WhiteText>Pending Requests Sent</WhiteText> */}
			{/* <FlatList
				userSearch={userSearch}
				data={state.currentUser.pending}
				keyExtractor={item => item.username}
				renderItem={({ item }) => {
					if (item.username.includes(userSearch)) {
						return <UserSearchItem currentUser={state.currentUser} friend={item} />;
					}
				}}
			/> */}
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
    width: Dimensions.get('window').width
	},
});

export default FriendsList;
