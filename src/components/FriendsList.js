import React, { useState, useContext } from 'react';
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
import { Entypo, MaterialIcons } from '@expo/vector-icons';
import UserAvatar from './UserAvatar';
import UserSearchItem from './UserSearchItem';
import WhiteText from './WhiteText';

const FriendsList = ({ user, showForm, setIsLoading }) => {
	const { addFriend, unblock, state } = useContext(ChannelContext);
	const [userSearch, setUserSearch] = useState('');

	return (
		<View style={styles.container}>
			<WhiteText>My Friends</WhiteText>
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
				data={state.currentUser.friends}
				keyExtractor={item => item.username}
				renderItem={({ item }) => {
					console.log('userSearch', userSearch);
					console.log('item.username', item.username);
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
