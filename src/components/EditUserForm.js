import React, { useState, useContext } from 'react';
import { View, StyleSheet, Image, Dimensions } from 'react-native';
import { Input, Button, Text } from 'react-native-elements';
import { Context as ChannelContext } from '../context/ChannelContext';
import { Context as AuthContext } from '../context/AuthContext';
import Spacer from './Spacer';
import AvatarPicker from './AvatarPicker';
import LoadingIndicator from './LoadingIndicator';
import BouncyInput from './BouncyInput';

const EditUserForm = ({ showForm }) => {
	const {
		state: { currentUser },
		updateUser,
		fetchChannels,
	} = useContext(ChannelContext);
	const { deleteUser } = useContext(AuthContext);
	const [newUsername, setNewUsername] = useState(currentUser.username);
	const [newPassword, setNewPassword] = useState('');
	const [newAvatar, setNewAvatar] = useState(currentUser.avatar);
	const [isLoading, setIsLoading] = useState(false);

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
	};

	const cancelForm = () => {
		showForm(false);
	};

	const handleDelete = async () => {
		showForm('');
		await deleteUser({
			username: currentUser.username,
			user_id: currentUser._id,
		});
	};

	if (isLoading) return <LoadingIndicator />;

	return (
		<View style={styles.container}>
			<Spacer>
				<BouncyInput
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
				<BouncyInput
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
				<Button buttonStyle={styles.deleteButton} title="Delete Account" onPress={handleDelete} />
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
	deleteButton: {
		padding: 10,
		backgroundColor: 'red',
	},
	buttonRow: {
		flexDirection: 'row',
		justifyContent: 'space-around',
	},
});

export default EditUserForm;
