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
import { SafeAreaView } from 'react-navigation';
import { Context as ChannelContext } from '../context/ChannelContext';
import SocketContext from '../context/SocketContext';
import AvatarPicker from '../components/AvatarPicker';
import { Entypo, MaterialIcons } from '@expo/vector-icons';
import UserAvatar from '../components/UserAvatar';
import UserSearchItem from '../components/UserSearchItem';
import WhiteText from '../components/WhiteText';

const DashScreen = ({ user, showForm, setIsLoading }) => {
	const { addFriend, unblock, state } = useContext(ChannelContext);
	const socket = useContext(SocketContext);
	const [userSearch, setUserSearch] = useState('');

	const handleClick = () => {
		showForm({ show: 'edit_user' });
	};

	const cancelForm = () => {
		showForm(false);
	};

	const handleChangeText = e => {
		setUserSearch(e.target);
		console.log('UserSearch being emitted', userSearch);
		socket.emit('searchuser', userSearch);
		console.log('socket emitting search');
	};

	return (
		<View style={styles.container}>
			<UserAvatar avatar={user.avatar} handleClick={handleClick} />
			<WhiteText>{user.username}</WhiteText>
			<Entypo
				name="edit"
				color="#0af"
				size={32}
				onPress={handleClick}
				style={{ alignSelf: 'center', marginLeft: 10 }}
			/>
			<WhiteText>My Friends</WhiteText>
			<Input
				label="Search Users"
				value={userSearch}
				onChangeText={handleChangeText}
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
			<Button buttonStyle={styles.button} title="Cancel" onPress={cancelForm} />
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

export default DashScreen;
