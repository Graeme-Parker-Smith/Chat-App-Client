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
import AvatarPicker from '../components/AvatarPicker';
import LoadingIndicator from './LoadingIndicator';
import { Entypo, MaterialIcons } from '@expo/vector-icons';
import UserSearchItem from './UserSearchItem';

const UserPanel = ({ user, showForm, setIsLoading }) => {
	const { addFriend, unblock, state } = useContext(ChannelContext);
	const [userSearch, setUserSearch] = useState('');

	const handleClick = () => {
		showForm('edit_user');
	};

	const cancelForm = () => {
		showForm(false);
	};

	return (
		<View>
			<Image source={{ uri: user.avatar }} style={styles.avatarStyle} />
			<Text>{user.username}</Text>
			<Entypo
				name="edit"
				color="#0af"
				size={32}
				onPress={handleClick}
				style={{ alignSelf: 'center', marginLeft: 10 }}
			/>
			<Text>My Friends</Text>
			<Input
				label="Search Users"
				value={userSearch}
				onChangeText={setUserSearch}
				autoCapitalize="none"
				autoCorrect={false}
				inputStyle={{ color: 'black' }}
				returnKeyType="send"
				selectTextOnFocus={true}
			/>
			<Button
				title="Add Friend"
				onPress={() =>
					addFriend({
						username: user.username,
						friendName: userSearch,
					})
				}
			/>
			<Button
				title="Remove Friend"
				onPress={() =>
					addFriend({
						username: user.username,
						friendName: userSearch,
						shouldRemove: true,
					})
				}
			/>
			<Button
				title="Block User"
				onPress={() =>
					addFriend({
						username: user.username,
						friendName: userSearch,
						shouldRemove: true,
						shouldBlock: true,
					})
				}
			/>
			<Button
				title="Unblock User"
				onPress={() =>
					unblock({
						username: user.username,
						friendName: userSearch,
					})
				}
			/>
			<FlatList
				userSearch={userSearch}
				data={state.currentUser.friends}
				keyExtractor={item => item.username}
				renderItem={({ item }) => {
					console.log('userSearch', userSearch);
					console.log('item.username', item.username);
					if (item.username.includes(userSearch)) {
						return <UserSearchItem />;
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
});

export default UserPanel;
