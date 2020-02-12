import React, { useState, useContext } from 'react';
import { View, StyleSheet, Image, Dimensions } from 'react-native';
import { Input, Button, Text } from 'react-native-elements';
import { Context as ChannelContext } from '../context/ChannelContext';
import { Context as AuthContext } from '../context/AuthContext';
import Spacer from './Spacer';
import AvatarPicker from './AvatarPicker';

const EditUserForm = ({ showForm, setIsLoading }) => {
	const {
		state: { currentUser },
		updateUser,
		fetchChannels,
	} = useContext(ChannelContext);
	const { tryLocalSignin } = useContext(AuthContext);
	const [newUsername, setNewUsername] = useState(currentUser.username);
	const [newPassword, setNewPassword] = useState('');
	const [newAvatar, setNewAvatar] = useState(currentUser.avatar);

	const handleSubmit = async () => {
		setIsLoading(true);
		await updateUser({
			username: currentUser.username,
			newUsername,
			newPassword,
			newAvatar: newAvatar.base64Uri,
		});
		showForm(false);
		await fetchChannels();
		setIsLoading(false);
	};

	const cancelForm = () => {
		showForm({ show: 'user_dash', item: currentUser });
	};

	return (
		<View style={styles.container}>
			<Text style={{ color: 'white' }}>Edit User Info</Text>
			<Spacer>
				<Input
					label="Edit Username"
					value={newUsername}
					onChangeText={setNewUsername}
					autoFocus={true}
					autoCapitalize="none"
					autoCorrect={false}
					inputStyle={{ color: 'white' }}
				/>
			</Spacer>
			<Spacer>
				<Input
					secureTextEntry
					label=" Edit Password"
					value={newPassword}
					onChangeText={setNewPassword}
					autoCapitalize="none"
					autoCorrect={false}
					inputStyle={{ color: 'white' }}
				/>
			</Spacer>
			<AvatarPicker avatar={newAvatar} setAvatar={setNewAvatar} whichForm={'User'} />
			<Spacer />
			<View style={styles.buttonRow}>
				<Button buttonStyle={styles.button} title="Update User Info" onPress={handleSubmit} />
				<Button buttonStyle={styles.button} title="Cancel" onPress={cancelForm} />
			</View>
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		height: Dimensions.get('window').height,
		width: Dimensions.get('window').width,
		backgroundColor: '#000',
	},
	button: {
		padding: 10,
	},
	buttonRow: {
		flexDirection: 'row',
		justifyContent: 'space-around',
	},
});

export default EditUserForm;
