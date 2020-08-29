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
import AnimSearchBar from './AnimSearchBar';

const FriendsList = ({ user, showForm, setIsLoading }) => {
	const { addFriend, unblock, state } = useContext(ChannelContext);
	const [userSearch, setUserSearch] = useState('');

	return (
		<View style={styles.container}>
			<WhiteText>My Friends</WhiteText>
			<AnimSearchBar
				placeholder="Search Friends"
				value={userSearch}
				onChangeText={setUserSearch}
				autoCapitalize="none"
				autoCorrect={false}
				inputStyle={{ color: 'white' }}
				returnKeyType="send"
				selectTextOnFocus={true}
			/>
			<FlatList
					style={styles.list}
					userSearch={userSearch}
				data={state.currentUser.friends}
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
    width: Dimensions.get('window').width

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
