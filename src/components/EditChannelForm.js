import React, { useState, useContext } from 'react';
import { View, StyleSheet, Image, Dimensions } from 'react-native';
import { Input, Button, Text } from 'react-native-elements';
import { Context as ChannelContext } from '../context/ChannelContext';
import { Context as AuthContext } from '../context/AuthContext';
import Spacer from './Spacer';
import AvatarPicker from './AvatarPicker';
import LoadingIndicator from './LoadingIndicator';


const EditChannelForm = ({ showForm, thisName, thisAvatar }) => {
	const {
		state: { currentUser, channels },
		updateChannel,
		fetchChannels,
		deleteChannel,
	} = useContext(ChannelContext);
	const { tryLocalSignin } = useContext(AuthContext);
	const [newName, setNewName] = useState(thisName);
	const [newAvatar, setNewAvatar] = useState(thisAvatar);
	const [isLoading, setIsLoading] = useState(false);
	const channelInfo = channels.find(channel => channel.name === thisName);
	const channel_id = channelInfo._id;
	console.log('channel_id', channel_id);
	const channelCreator = channelInfo.creator;
	console.log('channelCreator', channelCreator);
	const userCanEdit = currentUser.username === channelCreator;
	// console.log(thisName);
	// console.log(thisAvatar);

	const handleSubmit = async () => {
		if (!userCanEdit) {
			return;
		}
		setIsLoading(true);
		await updateChannel({
			username: currentUser.username,
			prevName: thisName,
			channel_id,
			newName,
			newAvatar: newAvatar.base64Uri,
		});
		showForm('');
		await fetchChannels();
		setIsLoading(false);
	};

	const cancelForm = () => {
		showForm('');
	};

	const handleDelete = async () => {
		if (!userCanEdit) {
			return;
		}
		// setIsLoading(true);
		showForm('');
		await deleteChannel({
			username: currentUser.username,
			roomName: thisName,
			channel_id: channel_id,
		});
		await fetchChannels();
		// setIsLoading(false);
	};

	if (isLoading) return <LoadingIndicator />;


	return (
		<View style={styles.container}>
			<Text style={{ color: 'white' }}>Edit Channel Info</Text>
			<Spacer>
				<Input
					label="Edit Channel Name"
					disabled={!userCanEdit}
					value={newName}
					onChangeText={setNewName}
					autoFocus={true}
					autoCapitalize="none"
					autoCorrect={false}
					inputStyle={{ color: 'white' }}
				/>
			</Spacer>
			<AvatarPicker avatar={newAvatar} setAvatar={setNewAvatar} whichForm={'Channel'} />
			<Spacer />
			<View style={styles.buttonRow}>
				<Button
					disabled={!userCanEdit}
					buttonStyle={styles.button}
					title="Update Channel Info"
					onPress={handleSubmit}
				/>
				<Button buttonStyle={styles.button} title="Cancel" onPress={cancelForm} />
				<Button
					disabled={!userCanEdit}
					buttonStyle={styles.deleteButton}
					title="Delete Channel"
					onPress={handleDelete}
				/>
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

export default EditChannelForm;
